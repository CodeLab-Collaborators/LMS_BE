"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentTrack_1 = require("../controller/studentTrack");
const studentTrackRouter = (0, express_1.Router)();
studentTrackRouter.post("/studentTrack/:studentID/:trackID", studentTrack_1.enrolledTrackController);
studentTrackRouter.get("/studentTrack/:studentID/:trackID", studentTrack_1.getTrackWithCoursesController);
studentTrackRouter.get("/studentTrack/:studentID", studentTrack_1.getAllTrackController);
exports.default = studentTrackRouter;
