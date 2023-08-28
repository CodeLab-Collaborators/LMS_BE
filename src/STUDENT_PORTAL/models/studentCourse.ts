import { Schema, model } from "mongoose";
import { IStudentCourse } from "../interface/studentTracks";

const studentCourseSchema: Schema<IStudentCourse> = new Schema(
  {
    studentID: { type: String },
    courseID: { type: String },
    trackID: { type: String },
    status: { type: String },
    completion_average: { type: Number },
    startdate: { type: String },
  },
  { versionKey: false }
);

const StudentCourse = model<IStudentCourse>(
  "StudentCourse",
  studentCourseSchema
);
export default StudentCourse;
