import { NextFunction, Request, Response } from "express";
import {
  enrollTrack,
  getAllEnrolledTrack,
  getStudentTrackWithCourses,
} from "../services/studentTrack";

export const enrolledTrackController = (
  req: Request,
  res: Response,
  next: NextFunction
) => enrollTrack(req, res, next);
export const getAllTrackController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getAllEnrolledTrack(req, res, next);
export const getTrackWithCoursesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getStudentTrackWithCourses(req, res, next);
