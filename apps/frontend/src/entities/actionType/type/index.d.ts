import { BaseEntity } from '../../../shared/types'

export interface ActionType extends BaseEntity {
    name: string;
    color: string;
    max: number;
}
