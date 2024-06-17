import { Response, Request } from "express";
import { ActionData, ActionStatusEnum, actionRepository } from "./index";

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
            const actionData: ActionData = {
                ActionType: req.body.ActionType,
                status: ActionStatusEnum.WAITING,
                createdAt: new Date(),
            }

            const { _id, error } = await actionRepository.insertOne(actionData)
            
            if (error) {
                res.status(400).json({ error });
                return;
            }

            res.status(201).json({ _id, ...actionData })
        } catch (error) {
            console.error("Failed to fetch action types: ", error);
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

            const { _id, error } = await actionRepository.deleteOne(id)
            
            if (error) {
                res.status(404).json({ error });
                return;
            }

            res.status(200).json(_id)
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