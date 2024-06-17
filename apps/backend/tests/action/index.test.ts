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

})