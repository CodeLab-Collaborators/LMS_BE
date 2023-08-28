import { Request, Response, NextFunction } from "express";
import {
  addModulesToCourse,
  createCourseService,
  deleteCourse,
  editCourses,
  getCourses,
  getOneCourseWithModules,
} from "../services/courses";

export const createCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createCourseService(req, res, next);

export const getCoursesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getCourses(req, res, next);

export const editCoursesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => editCourses(req, res, next);
export const deleteCoursesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => deleteCourse(req, res, next);
export const addModuleToCoursesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => addModulesToCourse(req, res, next);
export const getOneCourseWithModulesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getOneCourseWithModules(req, res, next);
