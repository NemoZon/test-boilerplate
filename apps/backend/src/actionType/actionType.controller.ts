import { Request, Response } from "express";
import { actionTypeRepository } from "./actionType.repository";


export class ActionTypeController {
    public static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await actionTypeRepository.findAll();
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No action types found' });
            }
        } catch (error) {
            console.error("Failed to fetch action types: ", error);
            if (error instanceof Error) {
                res.status(500).json({ error: "Internal server error", details: error.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    }
}