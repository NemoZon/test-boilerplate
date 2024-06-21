import { BaseEntity } from "../../../shared/types";

export interface Credit extends BaseEntity {
    ActionType: string;
    quantity: number;
}
