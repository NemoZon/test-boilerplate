import { Response, Request } from "express";
import { actionRepository } from "./index";

export class ActionController {
    public static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await actionRepository.findAll();
            res.status(200).json(result);
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
            const result = await actionRepository.findById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No action found' });
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