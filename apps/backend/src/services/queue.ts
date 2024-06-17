import { ActionData, actionRepository } from "../action";

export class Queue {
    private static IntervalId: NodeJS.Timer;
    private static nextAction: ActionData | null;
    private static delay: number;

    private static async deleteNextAction(): Promise<void> {        
        if (this.nextAction && this.nextAction._id) {
            await actionRepository.deleteOne(this.nextAction._id?.toString())
            this.nextAction = null
        } else {
            console.log('nextAction is undefined')
        }
    }

    private static async setNextAction(): Promise<void> {
        const actionList = await actionRepository.findAll();
        if (actionList.length > 0) {
            this.nextAction = actionList[0]
        } else {
            console.log('Queue is empty')
        }
    }

    public static async start(delay: number): Promise<void> {
        if (this.delay) {
            console.error('Queue already running')
            return;
        }
        this.delay = delay;

        actionRepository.setNextExecutionTime(delay)

        this.IntervalId = setInterval(async () => {
            await this.setNextAction()
            await this.deleteNextAction()
            actionRepository.setNextExecutionTime(delay)

        }, delay)
    }

    public static async stop() {
        if (this.IntervalId) {
            clearInterval(this.IntervalId)
            console.log('Queue has stopped')
            return;
        }
    }
}