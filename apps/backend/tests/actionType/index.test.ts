import { mongoClient } from '../../src/services/mongodb';
import { actionTypeRepository, createActionTypeData } from '../../src/actionType'
import { app } from '../../src/app'
import request from 'supertest';

afterAll(async () => {
    await mongoClient.close();
});

describe('Test /api/actiontype', () => {
    describe('GET /api/actiontype', () => {
        test('return a status 200 and a list of 3 action types with correct properties and data types', async () => {
            await actionTypeRepository.populate(3, createActionTypeData)
            const response = await request(app).get('/api/actiontype');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(3);
            expect(Object.keys(response.body[0])).toEqual(["_id", "name", "color", "max"]);
            expect(typeof response.body[0]._id).toBe("string");
            expect(typeof response.body[0].name).toBe("string");
            expect(typeof response.body[0].color).toBe("string");
            expect(typeof response.body[0].max).toBe("number");
        });
        test('return 404 when no action types are found', async () => {
            await actionTypeRepository.clear()
            const response = await request(app).get('/api/actiontype');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('No action types found');
        });
    })
    describe('GET /api/actiontype/:id', () => {
        test('return 400 if the id is not a valid ObjectId', async () => {
            const response = await request(app).get('/api/actiontype/hello');

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid id');
        });
        test('return 404 when no action type', async () => {
            await actionTypeRepository.clear()
            const response = await request(app).get('/api/actiontype/666ee56810e0fce8e846effa');
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('No action type found');
        });
        test('return 200 when the action type is found', async () => {
            const { _id } = await actionTypeRepository.insertOne(createActionTypeData())
            const response = await request(app).get(`/api/actiontype/${_id.toString()}`);
            expect(response.statusCode).toBe(200);
            expect(Object.keys(response.body)).toEqual(["_id", "name", "color", "max"]);
            expect(typeof response.body._id).toBe("string");
            expect(typeof response.body.name).toBe("string");
            expect(typeof response.body.color).toBe("string");
            expect(typeof response.body.max).toBe("number");
        });
    })
})