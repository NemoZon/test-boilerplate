import { app } from '../../../src/app'
import request from 'supertest';
import { createCreditData, creditRepository } from '../../../src/credit';
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

describe('Test /api/credit', () => {
  describe('GET /api/credit', () => {
    test('return a status 200 and a list of credits with correct properties and data types', async () => {
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
})