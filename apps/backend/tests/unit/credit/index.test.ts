import { ObjectId } from 'mongodb';
import { actionTypeRepository, createActionTypeData } from '../../../src/actionType'
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

describe('Unit test: Credit', () => {
  describe('CreditRepository methods', () => {
    test('insertOne inserts a single credit data correctly', async () => {
      const actionTypeData = createActionTypeData();
      const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
      const creditData = createCreditData({ ActionType: actionTypeId });

      const result = await creditRepository.insertOne(creditData);

      expect(result).toHaveProperty('_id');
      expect(result.error).toBeUndefined();
    });

    test('insertOne returns error when ActionType does not exist', async () => {
      const nonExistentActionTypeId = new ObjectId();
      const creditData = createCreditData({ ActionType: nonExistentActionTypeId });

      const result = await creditRepository.insertOne(creditData);

      expect(result).toEqual({ error: `ActionType with _id ${nonExistentActionTypeId.toString()} doesn't exist` });
    });

    test('findAll retrieves all credit entries', async () => {
      const actionTypeData = createActionTypeData();
      const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
      const creditData1 = createCreditData({ ActionType: actionTypeId });
      const creditData2 = createCreditData({ ActionType: actionTypeId });

      await creditRepository.insertOne(creditData1);
      await creditRepository.insertOne(creditData2);

      const results = await creditRepository.findAll();

      expect(results.length).toBe(2);
    });

    test('clear removes all credit entries', async () => {
      const actionTypeData = createActionTypeData();
      const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
      const creditData = createCreditData({ ActionType: actionTypeId });

      await creditRepository.insertOne(creditData);
      await creditRepository.clear();

      const results = await creditRepository.findAll();

      expect(results.length).toBe(0);
    });

    test('deleteOne removes a specific credit entry', async () => {
      const actionTypeData = createActionTypeData();
      const { _id: actionTypeId } = await actionTypeRepository.insertOne(actionTypeData);
      const creditData = createCreditData({ ActionType: actionTypeId });
      const { _id: creditId } = await creditRepository.insertOne(creditData);
      
      expect(creditId).toBeTruthy();
      if (creditId) {
        const deletionResult = await creditRepository.deleteOne(creditId.toString());

        const result = await creditRepository.findById(creditId.toString());
        expect(result).toBeNull();
        expect(deletionResult).toHaveProperty('_id', creditId);
      }
    });
  });
});