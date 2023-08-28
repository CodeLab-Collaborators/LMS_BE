import { Schema, model } from "mongoose";
import { ICourseAssessment, IQuestion } from "../interface/courses";

const questionSchema: Schema<IQuestion> = new Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { _id: false } // Exclude _id field from subdocuments
);

const courseAssessmentSchema: Schema<ICourseAssessment> = new Schema(
  {
    courseID: { type: String, required: true },
    assessmentID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { versionKey: false }
);

const CourseAssessment = model<ICourseAssessment>(
  "CourseAssessment",
  courseAssessmentSchema
);

export default CourseAssessment;
