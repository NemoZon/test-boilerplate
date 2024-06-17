
import { ObjectId } from 'mongodb';
import { BaseEntity } from '../base/entity'

export enum ActionStatusEnum {
    WAITING = "WAITING",
    EXECUTED = "EXECUTED"
}

export interface ActionData extends BaseEntity {
    ActionType: ObjectId;
    createdAt: Date;
    status: ActionStatusEnum;
}

