import { Router } from "express";
import {
  addModuleToCoursesController,
  createCourseController,
  deleteCoursesController,
  editCoursesController,
  getCoursesController,
  getOneCourseWithModulesController,
} from "../controller/courses";

const courseRouter = Router();

courseRouter.post("/course", createCourseController);
courseRouter.get("/course", getCoursesController);
courseRouter.patch("/course/:courseID", editCoursesController);
courseRouter.delete("/course/:courseID", deleteCoursesController);
courseRouter.post(
  "/courseModule/:courseID/:moduleID",
  addModuleToCoursesController
);
courseRouter.get("/course/:courseID", getOneCourseWithModulesController);

export default courseRouter;
