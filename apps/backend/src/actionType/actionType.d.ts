import { BaseEntity } from '../base/entity'

export interface ActionTypeData extends BaseEntity {
    name: string;
    color: string;
    max: number;
}
