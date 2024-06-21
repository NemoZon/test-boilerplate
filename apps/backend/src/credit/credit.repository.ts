import { ObjectId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { CreditData } from "./credit";
import { actionTypeRepository } from "../actionType";

class CreditRepository {
    private creditCollection = mongodb.collection<CreditData>('Credit');

    public async findAll(): Promise<CreditData[]> {
        const result = await this.creditCollection.find({}).toArray();
        return result;
    }

    public async clear(): Promise<void> {
        await this.creditCollection.deleteMany({});
    }

    public async insertOne(data: CreditData): Promise<Partial<{ _id: ObjectId, error: string }>> {

        const actionType = await actionTypeRepository.findById(data.ActionType.toString())

        if (!actionType) {
            return { error: `ActionType with _id ${data.ActionType.toString()} doesn't exist` }
        }

        const insertOneResult = await this.creditCollection.insertOne(data);

        return { _id: insertOneResult.insertedId }
    }

    public async insert(...data: CreditData[]): Promise<void> {
        await this.creditCollection.insertMany(data);
    }

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<CreditData>) => CreditData): Promise<void> {
        await this.clear();
        const players: CreditData[] = new Array(count);
        for (let i = 0; i < count; i++) {
            players[i] = fixturesGenerator()
        }
        await this.insert(...players);
    }

    public async findById(id: string): Promise<CreditData | null> {
        const result = await this.creditCollection.findOne({
            _id: new ObjectId(id),
        });

        return result;
    }

    public async findByActionType(id: string): Promise<CreditData | null> {
        const result = await this.creditCollection.findOne({
            ActionType: new ObjectId(id),
        });

        return result;
    }

    public async replace(data: CreditData): Promise<CreditData | null> {
        const exists = await this.findByActionType(data.ActionType.toString())
        if (exists?._id) {
            await this.deleteOne(exists._id.toString())
        }
        const insertOneResult = await this.creditCollection.insertOne(data);

        return { _id: insertOneResult.insertedId, ...data }
    }

    public async refreshAll(): Promise<CreditData[]> {
        const ActionTypes = await actionTypeRepository.findAll()
        const result: CreditData[] = []

        for (let i = 0; i < ActionTypes.length; i++) {
            const type = ActionTypes[i]
            if (type._id) {
                const newCredit = await this.replace({
                    ActionType: type._id,
                    quantity: (0.8 + Math.random() * 0.2) * type.max
                })
                if (newCredit) {
                    result.push(newCredit)
                }
            }
        }
        return result
    }

    public async deleteOne(_id: string): Promise<Partial<{ _id: ObjectId, error: string }>> {
        const credit = await this.findById(_id)
        if (!credit) {
            return { error: `Credit with _id ${_id} doesn't exist` }
        }
        await this.creditCollection.deleteOne({
            _id: credit._id,
        });

        return { _id: credit._id };
    }
}

export const creditRepository = new CreditRepository();