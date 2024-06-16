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

    public static async getById(req: Request, res: Response): Promise<void> {
        try {            
            const id = req.params.id
            const objectIdRegex = /[0-9a-f]{24}/
            if (!objectIdRegex.test(id)) {
                res.status(400).json({ error: 'Invalid id' });
                return;
            }
            const result = await actionTypeRepository.findById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No action type found' });
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