import { actionTypeRepository } from '../../../src/actionType/actionType.repository';
import { ActionTypeData } from '../../../src/actionType/actionType';
import { ObjectId } from 'mongodb';
import { createActionTypeData } from '../../../src/actionType';
import { mongoClient } from '../../../src/services/mongodb';

beforeAll(async () => {
    await mongoClient.connect();
});

afterEach(async () => {
    await mongoClient.db(process.env.DB_NAME).dropDatabase();
});

afterAll(async () => {
    await mongoClient.close();
});

describe('Unit test: ActionTypeRepository', () => {
    describe('ActionTypeRepository methods', () => {
        test('clear removes all documents from the collection', async () => {
            await actionTypeRepository.insertOne(createActionTypeData());
            await actionTypeRepository.clear();
            const result = await actionTypeRepository.findAll();
            expect(result.length).toBe(0);
        });

        test('insertOne inserts a single ActionType data correctly', async () => {
            const result = await actionTypeRepository.insertOne(createActionTypeData());
            expect(result).toHaveProperty('_id');
        });

        test('insert inserts multiple ActionType data correctly', async () => {
            const data: ActionTypeData[] = [
                createActionTypeData(),
                createActionTypeData()
            ];
            await actionTypeRepository.insert(...data);
            const result = await actionTypeRepository.findAll();
            expect(result.length).toBe(2);
        });

        test('populate clears the collection and inserts the specified number of documents', async () => {
            await actionTypeRepository.populate(3, createActionTypeData);
            const result = await actionTypeRepository.findAll();
            expect(result.length).toBe(3);
        });

        test('findAll returns all documents', async () => {
            const data: ActionTypeData[] = [
                createActionTypeData(),
                createActionTypeData()
            ];
            await actionTypeRepository.insert(...data);
            const result = await actionTypeRepository.findAll();
            expect(result.length).toBe(2);
        });

        test('findById returns the correct document', async () => {
            const data: ActionTypeData = createActionTypeData();
            const { _id } = await actionTypeRepository.insertOne(data);
            const result = await actionTypeRepository.findById(_id.toString());
            expect(result).toMatchObject(data);
        });

        test("findById returns null if the document doesn't exist", async () => {
            const result = await actionTypeRepository.findById(new ObjectId().toHexString());
            expect(result).toBeNull();
        });
    });
});
