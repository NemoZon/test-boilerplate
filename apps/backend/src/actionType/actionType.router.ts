import { Router } from "express";
import { ActionTypeController } from "./actionType.controller";

export const ActionTypeRouter = Router();

ActionTypeRouter.get('/', ActionTypeController.getAll);