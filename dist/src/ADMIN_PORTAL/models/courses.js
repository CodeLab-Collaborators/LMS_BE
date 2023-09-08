"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    courseID: { type: String },
    title: { type: String },
    description: { type: String },
    created: { type: Date },
    imgcover: { type: String },
}, { versionKey: false });
const Courses = (0, mongoose_1.model)("Course", courseSchema);
exports.default = Courses;
