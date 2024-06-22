import { ActionData, actionRepository } from "../action";
import { Express } from 'express';
import { ObjectId } from "mongodb";
import { WS } from "./ws";
import { CreditData, creditRepository } from "../credit";

export class Queue {
    private static IntervalId: NodeJS.Timer;
    private static nextAction: ActionData | null;
    private static lastDeleted: ObjectId | undefined;
    private static creditsRefreshSeconds: number;
    private static credits: CreditData[];
    private static countdown: number;
    private static app: Express | undefined;

    private static async deleteNextAction(): Promise<void> {
        if (this.nextAction && this.nextAction._id) {
            const { _id, error } = await actionRepository.deleteOne(this.nextAction._id?.toString())
            if (error) {
                this.nextAction = null
                return
            }
            this.lastDeleted = _id
        }
    }

    private static async refreshCredits(): Promise<void> {
        this.credits = await creditRepository.refreshAll()
    }

    private static async setNextAction(): Promise<void> {
        const actionList = await actionRepository.findAll();
        let i = 0
        let result: ActionData | null = null
        while (i < actionList.length && !result) {
            const action = actionList[i]
            const credit = this.credits.find((elem) => elem.ActionType.toString() === action.ActionType.toString())
            
            if (credit && credit._id && credit.quantity > 0) {
                const creditUpdated = await creditRepository.decrementQuantity(credit._id?.toString())
                if (creditUpdated) {
                    this.credits = this.credits.map((elem) => {
                        if (creditUpdated._id.toString() === elem._id?.toString()) {
                            return creditUpdated
                        } else {
                            return elem
                        }
                    })                    
                    result = action
                }
            }
            i++
        }
        
        this.nextAction = result
    }

    private static secondsToObject(s: number): { minutes: number, seconds: number } {
        const minutes = Math.floor(s / 60)
        const seconds = s % 60
        return {
            minutes,
            seconds
        }
    }

    public static async start(app: Express, delay: number, creditsRefreshSeconds: number): Promise<void> {
        if (this.app) {
            console.error('Queue already running')
            return;
        }
        this.app = app;
        this.countdown = delay;
        this.creditsRefreshSeconds = creditsRefreshSeconds;
        await this.refreshCredits();

        // creating WS object
        const ws = new WS();

        // creating WS server
        ws.create(app)

        // sending data every second
        this.IntervalId = setInterval(async () => {
            // action execution timer
            if (this.countdown > 0) {
                this.countdown -= 1;
            } else {
                await this.setNextAction()
                await this.deleteNextAction()
                this.countdown = delay;
            }

            // refresh credits timer
            if (this.creditsRefreshSeconds > 0) {
                this.creditsRefreshSeconds -= 1;
            } else {
                await this.refreshCredits();
                this.creditsRefreshSeconds = creditsRefreshSeconds;
            }

            ws.sendDataToAllClients({
                countdown: this.countdown,
                lastDeleted: this.lastDeleted,
                creditsRefreshTime: this.secondsToObject(this.creditsRefreshSeconds),
                credits: this.credits
            })
            this.lastDeleted = undefined
        }, 1000);

        // sending the timer on client connection
        ws.onConnection((websocket) => {
            const data = JSON.stringify({
                countdown: this.countdown,
                lastDeleted: this.lastDeleted,
                creditsRefreshTime: this.secondsToObject(this.creditsRefreshSeconds),
                credits: this.credits
            });
            websocket.send(data);
        });

        // starting server
        ws.start(process.env.WSS_PORT || 8000)
    }

    public static async stop() {
        if (this.IntervalId) {
            clearInterval(this.IntervalId)
            console.log('Queue has stopped')
            return;
        }
    }
}