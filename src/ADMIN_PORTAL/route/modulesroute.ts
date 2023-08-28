import { Router } from "express";
import {
  createModuleController,
  deleteModuleController,
  editModuleController,
  getAModuleController,
  getAllModuleController,
} from "../controller/modules";

const moduleRouter = Router();

moduleRouter.post("/module", createModuleController);
moduleRouter.get("/module", getAllModuleController);
moduleRouter.get("/module/:moduleID", getAModuleController);
moduleRouter.delete("/module/:moduleID", deleteModuleController);
moduleRouter.patch("/module/:moduleID", editModuleController);

export default moduleRouter;
