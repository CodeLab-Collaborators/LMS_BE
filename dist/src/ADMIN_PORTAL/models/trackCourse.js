"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trackCourseSchema = new mongoose_1.Schema({
    trackID: { type: String },
    courseID: { type: String },
}, { versionKey: false });
const TrackCourse = (0, mongoose_1.model)("TrackCourse", trackCourseSchema);
exports.default = TrackCourse;
