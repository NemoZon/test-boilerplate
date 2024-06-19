import { faker } from "@faker-js/faker";
import { CreditData } from "./credit";
import { ObjectId } from "mongodb";

export function createCreditData(partialData?: Partial<CreditData>): CreditData {
    return {
        ActionType: partialData?.ActionType ?? new ObjectId(),
        quantity: partialData?.quantity ?? faker.number.int(10),
    }
}
