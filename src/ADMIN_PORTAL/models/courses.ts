import { Schema, model } from "mongoose";
import { ICourses } from "../interface/courses";

const courseSchema: Schema<ICourses> = new Schema(
  {
    courseID: { type: String },
    title: { type: String },
    description: { type: String },
    created: { type: Date },
    imgcover: { type: String },
  },
  { versionKey: false }
);

const Courses = model<ICourses>("Course", courseSchema);

export default Courses;
