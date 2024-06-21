import { ObjectId } from 'mongodb';
import { BaseEntity } from '../base/entity'

export interface CreditData extends BaseEntity {
    ActionType: ObjectId;
    quantity: number;
}

