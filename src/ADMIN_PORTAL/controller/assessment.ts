import { Request, Response, NextFunction } from "express";
import {
  createAssessment,
  createQuestionService,
} from "../services/assessment";

export const createAssessmentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createAssessment(req, res, next);
export const createQuestionController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createQuestionService(req, res, next);
