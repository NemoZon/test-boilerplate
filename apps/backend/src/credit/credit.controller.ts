import { Response, Request } from "express";
import { CreditData, creditRepository } from "./index";

export class CreditController {
    public static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const result = await creditRepository.findAll();
            if (result.length === 0) {
                res.status(404).json({ error: 'No credits found' });
                return;
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Failed to fetch credits: ", error);
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
            const result = await creditRepository.findById(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'No action found' });
            }
        } catch (error) {
            console.error("Failed to fetch credits: ", error);
            if (error instanceof Error) {
                res.status(500).json({ error: "Internal server error", details: error.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    }

    public static async createOne(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body?.ActionType) {
                res.status(400).json({ error: "ActionType doesn't exist" });
                return;
            }
            const objectIdRegex = /[0-9a-f]{24}/
            if (!objectIdRegex.test(req.body.ActionType)) {
                res.status(400).json({ error: "ActionType is not a valid ObjectId" });
                return;
            }
            const exists = await creditRepository.findByActionType(req.body.ActionType)

            if (exists) {
                res.status(403).json({ error: "Credit with this ActionType already exists" });
                return;
            }

            const creditData: CreditData = {
                ActionType: req.body.ActionType,
                quantity: 0.8 + Math.random() * 0.2
            }

            const { _id, error } = await creditRepository.insertOne(creditData)

            if (error) {
                res.status(400).json({ error });
                return;
            }

            res.status(201).json({ _id, ...creditData })
        } catch (error) {
            console.error("Failed to fetch credits: ", error);
            if (error instanceof Error) {
                res.status(500).json({ error: "Internal server error", details: error.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    }

    public static async deleteOne(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const objectIdRegex = /[0-9a-f]{24}/
            if (!id || !objectIdRegex.test(id)) {
                res.status(400).json({ error: "Id is invalid ObjectId" });
                return;
            }

            const { _id, error } = await creditRepository.deleteOne(id)

            if (error) {
                res.status(404).json({ error });
                return;
            }

            res.status(200).json(_id)
        } catch (error) {
            console.error("Failed to fetch credits: ", error);
            if (error instanceof Error) {
                res.status(500).json({ error: "Internal server error", details: error.message });
            } else {
                res.status(500).json({ error: "Unknown error" });
            }
        }
    }
}