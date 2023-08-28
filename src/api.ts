import { Router } from "express";
import authRouter from "./STUDENT_PORTAL/route/authroute";
import trackRouter from "./ADMIN_PORTAL/route/trackroute";
import courseRouter from "./ADMIN_PORTAL/route/courseroute";
import studentTrackRouter from "./STUDENT_PORTAL/route/studentTrack";
import moduleRouter from "./ADMIN_PORTAL/route/modulesroute";
import studentCourseRouter from "./STUDENT_PORTAL/route/studentCourse";
import studentModuleRouter from "./STUDENT_PORTAL/route/studentModule";
import assessmentRouter from "./ADMIN_PORTAL/route/assessmentRoutes";

const api = Router();

// STUDENT_PORTAL
api
  .use("/students", authRouter)
  .use("/students", studentTrackRouter)
  .use("/students", studentCourseRouter)
  .use("/students", studentModuleRouter);

// ADMIN_PORTAL
api
  .use("/admin", trackRouter)
  .use("/admin", courseRouter)
  .use("/admin", moduleRouter)
  .use("/admin", assessmentRouter);

export default api;
