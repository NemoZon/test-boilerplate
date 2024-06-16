import { faker } from "@faker-js/faker";
import { ActionTypeData } from "./actionType";
            
export function createActionTypeData(partialData?: Partial<ActionTypeData>): ActionTypeData {
    return {
        name: partialData?.name ?? faker.lorem.word(),
        color: partialData?.color ?? faker.internet.color(),
        max: partialData?.max ?? faker.number.int({ max: 100 })
    }
}
