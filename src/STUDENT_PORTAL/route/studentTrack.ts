import { Router } from "express";
import {
  enrolledTrackController,
  getTrackWithCoursesController,
  getAllTrackController,
} from "../controller/studentTrack";

const studentTrackRouter = Router();

studentTrackRouter.post("/studentTrack", enrolledTrackController);
studentTrackRouter.get(
  "/studentTrack/:studentID/:trackID",
  getTrackWithCoursesController
);
studentTrackRouter.get("/studentTrack/:studentID", getAllTrackController);

export default studentTrackRouter;
