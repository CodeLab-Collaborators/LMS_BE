import { Router } from "express";
import {
  createAssessmentController,
  createQuestionController,
} from "../controller/assessment";
const assessmentRouter = Router();

assessmentRouter.post("/assessment/:courseID", createAssessmentController);
assessmentRouter.post(
  "/assessment-question/:assessmentID",
  createQuestionController
);

export default assessmentRouter;
