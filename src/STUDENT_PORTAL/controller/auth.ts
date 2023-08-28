import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  loginService,
  registerService,
  updateStudentProfile,
  getStudentProfileService,
} from "../services/auth";

export const registerController = (
  req: Request,
  res: Response,
  next: NextFunction
) => registerService(req, res, next);

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => loginService(req, res, next);

export const profileUpdateController = (
  req: Request,
  res: Response,
  next: NextFunction
) => updateStudentProfile(req, res, next);

export const getStudentProfileController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getStudentProfileService(req, res, next);
