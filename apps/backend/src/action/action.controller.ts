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
}