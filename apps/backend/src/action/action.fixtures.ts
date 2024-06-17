import { faker } from "@faker-js/faker";
import { ActionData } from "./action";
import { ObjectId } from "mongodb";
import {ActionStatusEnum} from './index'

const getRandomStatus = (): ActionStatusEnum => {
    return faker.datatype.boolean() ? ActionStatusEnum.EXECUTED : ActionStatusEnum.WAITING
}

export function createActionData(partialData?: Partial<ActionData>): ActionData {
    return {
        ActionType: partialData?.ActionType ?? new ObjectId(),
        status: partialData?.status ?? getRandomStatus(),
        createdAt:  partialData?.createdAt ?? faker.date.recent({ days: 10 }),
    }
}
