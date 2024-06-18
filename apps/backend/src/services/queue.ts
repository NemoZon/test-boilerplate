import { ActionData, actionRepository } from "../action";
import http from 'http';
import WebSocket from 'ws';
import { Express } from 'express';
import { ObjectId } from "mongodb";

export class Queue {
    private static IntervalId: NodeJS.Timer;
    private static nextAction: ActionData | null;
    private static lastDeleted: ObjectId | undefined;
    private static delay: number;
    private static countdown: number;
    private static server: http.Server | undefined;
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
        this.server = http.createServer(app);

        const wss = new WebSocket.Server({ server: this.server });

        this.IntervalId = setInterval(async () => {
            if (this.countdown > 0) {
                this.countdown -= 1;
            } else {
                await this.setNextAction()
                await this.deleteNextAction()
                this.countdown = this.delay;
            }
        }, 1000);

        wss.on('connection', (ws) => {
            const sendTime = async () => {
                if (this.countdown > 0) {
                    ws.send(JSON.stringify({ countdown: this.countdown }));
                } else {
                    ws.send(JSON.stringify({ countdown: this.countdown, lastDeleted: this.lastDeleted?.toString() }));
                }
            };
            ws.send(JSON.stringify({ countdown: this.countdown }));

            this.IntervalId = setInterval(sendTime, 1000);

            ws.on('close', () => {
                clearInterval(this.IntervalId);
            });
        });
        this.server.listen(8080, () => {
            console.log(`WSS is listening on port ${8080}`);
        });
    }

    public static async stop() {
        if (this.IntervalId) {
            clearInterval(this.IntervalId)
            console.log('Queue has stopped')
            return;
        }
    }
}