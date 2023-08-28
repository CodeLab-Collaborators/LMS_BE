import { Request, Response, NextFunction } from "express";
import {
  addCourseToTrack,
  createTrackService,
  deleteTrack,
  editTracks,
  getOneTrackWithCourses,
  getTracks,
} from "../services/tracks";

export const createTrackController = (
  req: Request,
  res: Response,
  next: NextFunction
) => createTrackService(req, res, next);

export const getTracksController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getTracks(req, res, next);

export const editTracksController = (
  req: Request,
  res: Response,
  next: NextFunction
) => editTracks(req, res, next);
export const deleteTracksController = (
  req: Request,
  res: Response,
  next: NextFunction
) => deleteTrack(req, res, next);
export const addTrackCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => addCourseToTrack(req, res, next);
export const getTrackCourseController = (
  req: Request,
  res: Response,
  next: NextFunction
) => getOneTrackWithCourses(req, res, next);
