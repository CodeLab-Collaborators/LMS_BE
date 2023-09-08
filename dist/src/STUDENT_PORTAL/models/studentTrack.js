"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentTrackSchema = new mongoose_1.Schema({
    trackID: { type: String },
    studentID: { type: String },
    status: { type: String },
    completion_average: { type: Number },
    dateEnrolled: { type: String },
    total_courses: { type: Number },
}, { versionKey: false });
const StudentTrack = (0, mongoose_1.model)("StudentTrack", studentTrackSchema);
exports.default = StudentTrack;
