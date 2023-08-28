import { Router } from "express";
import {
  addTrackCourseController,
  createTrackController,
  deleteTracksController,
  editTracksController,
  getTrackCourseController,
  getTracksController,
} from "../controller/track";

const trackRouter = Router();

trackRouter.post("/track", createTrackController);
trackRouter.get("/track", getTracksController);
trackRouter.patch("/track/:trackID", editTracksController);
trackRouter.delete("/track/:trackID", deleteTracksController);
trackRouter.post("/trackCourse", addTrackCourseController);
trackRouter.get("/track/:trackID", getTrackCourseController);
export default trackRouter;
