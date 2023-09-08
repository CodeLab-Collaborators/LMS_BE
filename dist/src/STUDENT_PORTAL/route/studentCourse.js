"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentCourse_1 = require("../controller/studentCourse");
const studentCourseRouter = (0, express_1.Router)();
studentCourseRouter.post("/studentCourse/:studentID/:trackID/:courseID", studentCourse_1.startCourseController);
studentCourseRouter.get("/studentCourse/:studentID/:courseID", studentCourse_1.getStudentCourseController);
studentCourseRouter.post("/complete-course/:studentID/:trackID/:courseID", studentCourse_1.getStudentCourseController);
exports.default = studentCourseRouter;
