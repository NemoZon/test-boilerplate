import { ObjectId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { ActionTypeData } from "./actionType";

class ActionTypeRepository {
    private actionTypeCollection = mongodb.collection<ActionTypeData>('ActionType');

    public async clear(): Promise<void> {
        await this.actionTypeCollection.deleteMany({});
    }

    public async insertOne(data: ActionTypeData): Promise<{ _id: ObjectId }> {
        const insertOneResult = await this.actionTypeCollection.insertOne(data);
        return { _id: insertOneResult.insertedId }
    }

    public async insert(...data: ActionTypeData[]): Promise<void> {
        await this.actionTypeCollection.insertMany(data);
    }

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<ActionTypeData>) => ActionTypeData): Promise<void> {
        await this.clear();
        const players: ActionTypeData[] = new Array(count);
        for (let i = 0; i < count; i++) {
            players[i] = fixturesGenerator()
        }        
        await this.insert(...players);
    }

    public async findAll(): Promise<ActionTypeData[]> {
        const result = await this.actionTypeCollection.find({}).toArray();

        return result;
    }

    public async findById(id: string): Promise<ActionTypeData | null> {
        const result = await this.actionTypeCollection.findOne({
            _id: new ObjectId(id),
        });

        return result;
    }
}

export const actionTypeRepository = new ActionTypeRepository();