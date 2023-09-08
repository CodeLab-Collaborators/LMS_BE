"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentModuleSchema = new mongoose_1.Schema({
    studentID: { type: String },
    courseID: { type: String },
    moduleID: { type: String },
    trackID: { type: String },
    status: { type: String },
    startDate: { type: String },
}, { versionKey: false });
const StudentModule = (0, mongoose_1.model)("StudentModule", studentModuleSchema);
exports.default = StudentModule;
