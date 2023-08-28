import { NextFunction, Request, Response } from "express";
import {
  startModule,
  completeModule,
  getStudentModule,
} from "../services/studentModule";

export const startModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => startModule(req, res, next);
export const completeModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => completeModule(req, res, next);
export const getModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getStudentModule(req, res, next);
