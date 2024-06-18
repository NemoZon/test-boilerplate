import { BaseEntity } from "../../../shared/types/";

export enum ActionStatusEnum {
    WAITING = "WAITING",
    EXECUTED = "EXECUTED"
}

export interface Action extends BaseEntity {
    ActionType: string;
    createdAt: Date;
    status: ActionStatusEnum;
}