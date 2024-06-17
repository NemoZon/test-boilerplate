import { mongoClient } from '../../src/services/mongodb';
import { actionTypeRepository, createActionTypeData } from '../../src/actionType'
import { app } from '../../src/app'
import request from 'supertest';
import { actionRepository, createActionData } from '../../src/action';
import { ActionStatusEnum } from '../../src/action'
import { Queue } from '../../src/services/queue';

afterAll(async () => {
    await mongoClient.close();
});

describe('Test /api/action', () => {
    describe('GET /api/action', () => {
        test('return a status 200 and a list of 3 actions with correct properties and data types', async () => {
            await actionRepository.populate(3, createActionData)
            const response = await request(app).get('/api/action');

            expect(response.statusCode).toBe(200);

            expect(response.body[0]).toHaveProperty('ActionType');
            expect(typeof response.body[0].ActionType).toBe('string');

            expect(response.body[0]).toHaveProperty('createdAt');
            expect(new Date(response.body[0].createdAt).getTime()).not.toBeNaN();

            expect(Object.values(ActionStatusEnum)).toContain(response.body[0].status);
        });
        test('check Action values', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            const { _id } = await actionTypeRepository.insertOne(createActionTypeData());

            const now = new Date;
            await actionRepository.insert(createActionData({
                ActionType: _id,
                createdAt: now,
                status: ActionStatusEnum.WAITING
            }))

            const response = await request(app).get('/api/action');

            expect(response.body[0].ActionType).toBe(_id.toString());
            expect(new Date(response.body[0].createdAt)).toEqual(now);
            expect(response.body[0].status).toBe(ActionStatusEnum.WAITING);
        });
        test('return 200 when no action are found', async () => {
            await actionRepository.clear()
            const response = await request(app).get('/api/action');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
        });
    })
    describe('GET /api/action/nextExecutionTime', () => {
        test('return 200 and date in ISO 8601 format', async () => {
            const response = await request(app).get('/api/action/nextExecutionTime');
            const now = new Date()
            expect(response.statusCode).toBe(200);

            expect(new Date(response.body)).not.toBeNaN();
            expect(new Date(response.body) >= now).toBeTruthy();
        });
    })
    describe('GET /api/action/:id', () => {
        test('return 400 if the id is not a valid ObjectId', async () => {
            const response = await request(app).get('/api/action/hello');

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid id');
        });
        test('return 404 when no action', async () => {
            await actionRepository.clear()
            const response = await request(app).get('/api/action/666ee56810e0fce8e846effa');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('No action found');
        });
        test('return 200 when the action is found', async () => {
            const { _id: actionTypeId } = await actionTypeRepository.insertOne(createActionTypeData())
            const { _id } = await actionRepository.insertOne(createActionData({
                ActionType: actionTypeId
            }))
            const response = await request(app).get(`/api/action/${_id?.toString()}`);

            expect(response.statusCode).toBe(200);

            expect(response.body).toHaveProperty('ActionType');
            expect(typeof response.body.ActionType).toBe('string');

            expect(response.body).toHaveProperty('createdAt');
            expect(new Date(response.body.createdAt).getTime()).not.toBeNaN();

            expect(Object.values(ActionStatusEnum)).toContain(response.body.status);
        });
        test('check Action values', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            const { _id: actionTypeId } = await actionTypeRepository.insertOne(createActionTypeData());

            const now = new Date;
            const { _id } = await actionRepository.insertOne(createActionData({
                ActionType: actionTypeId,
                createdAt: now,
                status: ActionStatusEnum.WAITING
            }))

            const response = await request(app).get(`/api/action/${_id?.toString()}`);

            expect(response.body.ActionType).toBe(actionTypeId.toString());
            expect(new Date(response.body.createdAt)).toEqual(now);
            expect(response.body.status).toBe(ActionStatusEnum.WAITING);
        });
    })
    describe('POST /api/action/', () => {
        test('return 400 if the body is not a valid Action', async () => {
            const response = await request(app).post('/api/action/').send({
                message: 'hello'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("ActionType doesn't exist");
        });
        test('return 400 if the ActionType id is invalid', async () => {
            await actionTypeRepository.clear();
            const response = await request(app).post('/api/action/').send({
                ActionType: '666eb45790b3e08861d6fbc9',
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("ActionType with _id 666eb45790b3e08861d6fbc9 doesn't exist");
        });
        test('return 201 when the action was created', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            const { _id } = await actionTypeRepository.insertOne(createActionTypeData());

            const response = await request(app).post('/api/action/').send({
                ActionType: _id.toString()
            });

            expect(response.statusCode).toBe(201);

            expect(response.body).toHaveProperty('_id');
            expect(typeof response.body._id).toBe("string");

            expect(response.body).toHaveProperty('ActionType');
            expect(response.body.ActionType).toBe(_id.toString());

            expect(response.body).toHaveProperty('createdAt');
            expect(new Date(response.body.createdAt).getTime()).not.toBeNaN()

            expect(response.body.status).toBe(ActionStatusEnum.WAITING);
        });

        test('createdAt is a server time in ISO 8601 format', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            const { _id } = await actionTypeRepository.insertOne(createActionTypeData());

            const response = await request(app).post('/api/action/').send({
                ActionType: _id
            });

            const createdAt = new Date(response.body.createdAt).toISOString()

            expect(createdAt).toBe(response.body.createdAt);
        });
    })
})

describe('DELETE /api/action/:id', () => {
    test('return 200 if Action was deleted successful', async () => {
        await actionRepository.clear();
        await actionTypeRepository.clear();

        const { _id: actionTypeId } = await actionTypeRepository.insertOne(createActionTypeData());

        const now = new Date;
        const { _id } = await actionRepository.insertOne(createActionData({
            ActionType: actionTypeId,
            createdAt: now,
            status: ActionStatusEnum.WAITING
        }))

        const response = await request(app).delete(`/api/action/${_id?.toString()}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(_id?.toString());
    });
    test('return 400 if the id is invalid', async () => {
        const response = await request(app).delete(`/api/action/hello`);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Id is invalid ObjectId");
    });
    test("return 404 if the resource doesn't exist", async () => {
        const response = await request(app).delete(`/api/action/666eb45790b3e08861d6fbc9`);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Action with _id 666eb45790b3e08861d6fbc9 doesn't exist");
    });
})