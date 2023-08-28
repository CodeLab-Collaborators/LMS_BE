import { Request, Response, NextFunction } from "express";
import {
  createModuleservice,
  editModule,
  getAModule,
  getAllModule,
  deleteModule,
} from "../services/modules";

export const createModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createModuleservice(req, res, next);
export const getAllModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => editModule(req, res, next);
export const getAModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getAModule(req, res, next);
export const editModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getAllModule(req, res, next);
export const deleteModuleController = (
  req: Request,
  res: Response,
  next: NextFunction
) => deleteModule(req, res, next);
