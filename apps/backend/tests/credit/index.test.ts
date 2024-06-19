import { mongoClient } from '../../src/services/mongodb';
import { actionTypeRepository, createActionTypeData } from '../../src/actionType'
import { app } from '../../src/app'
import request from 'supertest';
import { createCreditData, creditRepository } from '../../src/credit';
import { ObjectId } from 'mongodb';

afterAll(async () => {
    await mongoClient.close();
});

describe('Test /api/credit', () => {
    describe('GET /api/credit', () => {
        test('return a status 200 and a list of credits with correct properties and data types', async () => {
            await creditRepository.clear()
            await creditRepository.populate(3, createCreditData)
            const response = await request(app).get('/api/credit');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(3);
            expect(Object.keys(response.body[0])).toEqual(["_id", "ActionType", "quantity"]);
            expect(typeof response.body[0]._id).toBe("string");
            expect(typeof response.body[0].ActionType).toBe("string");
            expect(typeof response.body[0].quantity).toBe("number");
        });
        test('return 404 when no credits are found', async () => {
            await creditRepository.clear()
            const response = await request(app).get('/api/credit');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('No credits found');
        });
    })

    describe('credit repository methodes', () => {
        test('insertOne inserts a single credit data correctly', async () => {
            const { _id } = await actionTypeRepository.insertOne(createActionTypeData({

            }))
            const result = await creditRepository.insertOne(createCreditData({
                ActionType: _id
            }));
            expect(result).toHaveProperty('_id');
        });

        test('insertOne returns error when ActionType does not exist', async () => {
            await actionTypeRepository.clear()
            const _id = new ObjectId()
            const result = await creditRepository.insertOne(createCreditData({
                ActionType: _id
            }));
            expect(result).toEqual({ error: `ActionType with _id ${_id.toString()} doesn't exist` });
        });
    })
})