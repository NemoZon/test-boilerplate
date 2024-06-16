import { Request, Response } from "express";
import { actionTypeRepository } from "./actionType.repository";


export class ActionTypeController {
    public static async getAll(req: Request, res: Response): Promise<void> {
        const result = await actionTypeRepository.findAll();
        res.status(200).json(result);
    }
}