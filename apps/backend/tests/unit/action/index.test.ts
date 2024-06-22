import { ObjectId } from 'mongodb';
import { actionTypeRepository, createActionTypeData } from '../../../src/actionType';
import { createActionData, actionRepository } from '../../../src/action';
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

describe('Unit test: ActionRepository', () => {
    describe('ActionRepository methods', () => {
        test('clear removes all documents from the collection', async () => {
            await actionRepository.insertOne(createActionData({ ActionType: new ObjectId() }));
            await actionRepository.clear();
            const result = await actionRepository.findAll();
            expect(result.length).toBe(0);
        });

        test('insertOne inserts a single Action data correctly and checks ActionType existence', async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            const actionData = createActionData({ ActionType: actionTypeId });
            const result = await actionRepository.insertOne(actionData);
            expect(result).toHaveProperty('_id');
            expect(result.error).toBeUndefined();
        });

        test('insertOne returns error when ActionType does not exist', async () => {
            const nonExistentActionTypeId = new ObjectId();
            const actionData = createActionData({ ActionType: nonExistentActionTypeId });
            const result = await actionRepository.insertOne(actionData);
            expect(result).toEqual({ error: `ActionType with _id ${nonExistentActionTypeId.toString()} doesn't exist` });
        });

        test('insert inserts multiple Action data correctly', async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            const actions = [
                createActionData({ ActionType: actionTypeId }),
                createActionData({ ActionType: actionTypeId })
            ];
            await actionRepository.insert(...actions);
            const result = await actionRepository.findAll();
            expect(result.length).toBe(2);
        });

        test('populate clears the collection and inserts the specified number of documents', async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            await actionRepository.populate(3, () => createActionData({ ActionType: actionTypeId }));
            const result = await actionRepository.findAll();
            expect(result.length).toBe(3);
        });

        test('findAll returns all documents', async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            const actions = [
                createActionData({ ActionType: actionTypeId }),
                createActionData({ ActionType: actionTypeId })
            ];
            await actionRepository.insert(...actions);
            const result = await actionRepository.findAll();
            expect(result.length).toBe(2);
        });

        test('findById returns the correct document', async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            const actionData = createActionData({ ActionType: actionTypeId });
            const { _id: actionId } = await actionRepository.insertOne(actionData);
            expect(actionId).toBeTruthy();
            if (actionId) {
                const result = await actionRepository.findById(actionId.toString());
                expect(result).toMatchObject(actionData);
            }
        });

        test("findById returns null if the document doesn't exist", async () => {
            const result = await actionRepository.findById(new ObjectId().toHexString());
            expect(result).toBeNull();
        });

        test("deleteOne removes the specific action and return the _id", async () => {
            const actionTypeData = createActionTypeData();
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
            const actionData = createActionData({ ActionType: actionTypeId });
            const { _id: actionId } = await actionRepository.insertOne(actionData);
            expect(actionId).toBeTruthy();
            if (actionId) {
                const deletionResult = await actionRepository.deleteOne(actionId.toString());
                const result = await actionRepository.findById(actionId.toString());
                expect(result).toBeNull();
                expect(deletionResult).toHaveProperty('_id', actionId);
            }
        });
    });
});
