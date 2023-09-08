"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseModuleSchema = new mongoose_1.Schema({
    moduleID: { type: String },
    courseID: { type: String },
    created: { type: Date },
}, { versionKey: false });
const CourseModule = (0, mongoose_1.model)("CourseModule", CourseModuleSchema);
exports.default = CourseModule;
