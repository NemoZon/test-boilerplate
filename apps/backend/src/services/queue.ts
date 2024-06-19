import { ActionData, actionRepository } from "../action";
import { Express } from 'express';
import { ObjectId } from "mongodb";
import { WS } from "./ws";

export class Queue {
    private static IntervalId: NodeJS.Timer;
    private static nextAction: ActionData | null;
    private static lastDeleted: ObjectId | undefined;
    private static delay: number;
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

    private static async setNextAction(): Promise<void> {
        const actionList = await actionRepository.findAll();
        if (actionList.length > 0) {
            this.nextAction = actionList[0]
        }
    }

    public static async start(app: Express, delay: number): Promise<void> {
        if (this.app) {
            console.error('Queue already running')
            return;
        }
        this.delay = delay;
        this.app = app;
        this.countdown = this.delay;

        // creating WS object
        const ws = new WS();

        // creating WS server
        ws.create(app)

        // sending data every second
        this.IntervalId = setInterval(async () => {
            if (this.countdown > 0) {
                this.countdown -= 1;
            } else {
                await this.setNextAction()
                await this.deleteNextAction()
                this.countdown = this.delay;
            }
            ws.sendDataToAllClients({ countdown: this.countdown, lastDeleted: this.lastDeleted })
            this.lastDeleted = undefined
        }, 1000);

        // sending the timer on client connection
        ws.onConnection((websocket) => {
            const data = JSON.stringify({ countdown: this.countdown });
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