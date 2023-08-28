import { Router } from "express";
import {
  startCourseController,
  getStudentCourseController,
} from "../controller/studentCourse";
const studentCourseRouter = Router();

studentCourseRouter.post(
  "/studentCourse/:studentID/:trackID/:courseID",
  startCourseController
);
studentCourseRouter.get(
  "/studentCourse/:studentID/:courseID",
  getStudentCourseController
);
studentCourseRouter.post(
  "/complete-course/:studentID/:trackID/:courseID",
  getStudentCourseController
);
export default studentCourseRouter;
