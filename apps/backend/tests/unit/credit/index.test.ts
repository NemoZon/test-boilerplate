import { ObjectId } from 'mongodb';
import { actionTypeRepository, createActionTypeData } from '../../../src/actionType'
import { createCreditData, creditRepository } from '../../../src/credit';
import { mongoClient } from '../../../src/services/mongodb';

beforeAll(async () => {
  await mongoClient.connect();
});

beforeEach(async () => {
  await mongoClient.db(process.env.DB_NAME).dropDatabase();
});

afterAll(async () => {
  await mongoClient.close();
});

describe('Unit test: Credit', () => {

  describe('credit repository methodes', () => {
    test('insertOne inserts a single credit data correctly', async () => {
      const { _id } = await actionTypeRepository.insertOne(createActionTypeData())
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