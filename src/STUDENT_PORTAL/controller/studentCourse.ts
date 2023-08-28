import {
  getStudentCourseWithModules,
  startCourseService,
  completeCourse,
} from "../services/studentCourse";
import { NextFunction, Request, Response } from "express";

export const startCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => startCourseService(req, res, next);
export const getStudentCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getStudentCourseWithModules(req, res, next);
export const completeCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => completeCourse(req, res, next);
