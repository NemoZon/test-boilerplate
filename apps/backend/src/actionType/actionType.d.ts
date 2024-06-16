import { ObjectId } from "mongodb";

export interface ActionTypeData {
    _id?: ObjectId;
    name: string;
    color: string;
    max: number;
}
