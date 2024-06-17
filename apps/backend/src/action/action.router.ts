import { Router } from "express";
import { ActionController } from "./action.controller";

export const ActionRouter = Router();

ActionRouter.get('/', ActionController.getAll);
ActionRouter.get('/:id', ActionController.getById);
ActionRouter.post('/', ActionController.createOne);
ActionRouter.delete('/:id', ActionController.deleteOne);
