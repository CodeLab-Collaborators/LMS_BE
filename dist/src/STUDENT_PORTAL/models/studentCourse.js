"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentCourseSchema = new mongoose_1.Schema({
    studentID: { type: String },
    courseID: { type: String },
    trackID: { type: String },
    status: { type: String },
    completion_average: { type: Number },
    startdate: { type: String },
}, { versionKey: false });
const StudentCourse = (0, mongoose_1.model)("StudentCourse", studentCourseSchema);
exports.default = StudentCourse;
