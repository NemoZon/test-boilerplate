import { mongoClient } from '../../src/services/mongodb';
import { actionTypeRepository, createActionTypeData } from '../../src/actionType'
import { app } from '../../src/app'
import request from 'supertest';
import { actionRepository, createActionData } from '../../src/action';
import { ActionStatusEnum } from '../../src/action'

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

            await actionTypeRepository.insert(createActionTypeData());
            const actionTypeResponse = await request(app).get('/api/actiontype');
            const actionTypeId = actionTypeResponse.body[0]._id

            const now = new Date;
            await actionRepository.insert(createActionData({
                ActionType: actionTypeId,
                createdAt: now,
                status: ActionStatusEnum.WAITING
            }))

            const response = await request(app).get('/api/action');

            expect(response.body[0].ActionType).toBe(actionTypeId);
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
            await actionRepository.populate(1, createActionData)
            const actionResponse = await request(app).get('/api/action/');
            const id = actionResponse.body[0]._id
            const response = await request(app).get(`/api/action/${id}`);

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

            await actionTypeRepository.insert(createActionTypeData());
            const actionTypeResponse = await request(app).get('/api/actiontype');
            const actionTypeId = actionTypeResponse.body[0]._id

            const now = new Date;
            await actionRepository.insert(createActionData({
                ActionType: actionTypeId,
                createdAt: now,
                status: ActionStatusEnum.WAITING
            }))

            const actionsResponse = await request(app).get('/api/action');
            const id = actionsResponse.body[0]._id

            const response = await request(app).get(`/api/action/${id}`);

            expect(response.body.ActionType).toBe(actionTypeId);
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
            expect(response.body.error).toBe('Invalid Action entity');
        });
        test('return 400 if the ActionType id is invalid', async () => {
            await actionTypeRepository.clear();
            const response = await request(app).post('/api/action/').send({
                ActionType: '666eb45790b3e08861d6fbc9',
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("ActionType with _id 666eb45790b3e08861d6fbc9 doesn't exist");
        });
        test('return 200 when the action was created', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            await actionTypeRepository.insert(createActionTypeData());
            const actionTypeResponse = await request(app).get('/api/actiontype');
            const actionTypeId = actionTypeResponse.body[0]._id

            const response = await request(app).post('/api/action/').send({
                ActionType: actionTypeId
            });
   
            expect(response.statusCode).toBe(200);

            expect(response.body).toHaveProperty('_id');
            expect(typeof response.body._id).toBe("string");

            expect(response.body).toHaveProperty('ActionType');
            expect(response.body.ActionType).toBe(actionTypeId);

            expect(response.body).toHaveProperty('createdAt');
            expect(new Date(response.body.createdAt).getTime()).not.toBeNaN()

            expect(response.body.status).toBe(ActionStatusEnum.WAITING);
        });
        
        test('createdAt is a server time in ISO 8601 format', async () => {
            await actionRepository.clear();
            await actionTypeRepository.clear();

            await actionTypeRepository.insert(createActionTypeData());
            const actionTypeResponse = await request(app).get('/api/actiontype');
            const actionTypeId = actionTypeResponse.body[0]._id

            const response = await request(app).post('/api/action/').send({
                ActionType: actionTypeId
            });
   
            expect(response.statusCode).toBe(200);

            const createdAt = new Date(response.body.createdAt)

            expect(createdAt.toISOString()).toBe(response.body.createdAt);
        });
    })
})