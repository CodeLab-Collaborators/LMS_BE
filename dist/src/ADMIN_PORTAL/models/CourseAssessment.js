"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
}, { _id: false } // Exclude _id field from subdocuments
);
const courseAssessmentSchema = new mongoose_1.Schema({
    courseID: { type: String, required: true },
    assessmentID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
}, { versionKey: false });
const CourseAssessment = (0, mongoose_1.model)("CourseAssessment", courseAssessmentSchema);
exports.default = CourseAssessment;
