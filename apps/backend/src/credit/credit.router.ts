import { Router } from "express";
import { CreditController } from "./credit.controller";

export const CreditRouter = Router();

CreditRouter.get('/', CreditController.getAll);
