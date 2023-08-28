import { Router } from "express";
import {
  completeModuleController,
  getModuleController,
  startModuleController,
} from "../controller/studentModule";
const studentModuleRouter = Router();

studentModuleRouter.post(
  "/student-start-module/:studentID/:courseID/:moduleID",
  startModuleController
);
studentModuleRouter.post(
  "/student-complete-module/:trackID/:studentID/:courseID/:moduleID",
  completeModuleController
);
studentModuleRouter.get(
  "/student-module/:studentID/:courseID/:moduleID",
  getModuleController
);

export default studentModuleRouter;
