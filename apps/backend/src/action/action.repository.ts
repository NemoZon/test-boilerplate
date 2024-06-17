import { ObjectId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { ActionData } from "./action";

class ActionRepository {
    private actionCollection = mongodb.collection<ActionData>('Action');

    public async findAll(): Promise<ActionData[]> {
        const result = await this.actionCollection.find({}).toArray();
        return result;
    }
    
    public async clear(): Promise<void> {
        await this.actionCollection.deleteMany({});
    }

    public async insert(...data: ActionData[]): Promise<void> {
        await this.actionCollection.insertMany(data);
    }

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<ActionData>) => ActionData): Promise<void> {
        await this.clear();
        const players: ActionData[] = new Array(count);
        for (let i = 0; i < count; i++) {
            players[i] = fixturesGenerator()
        }        
        await this.insert(...players);
    }

    public async findById(id: string): Promise<ActionData | null> {
        const result = await this.actionCollection.findOne({
            _id: new ObjectId(id),
        });

        return result;
    }
}

export const actionRepository = new ActionRepository();