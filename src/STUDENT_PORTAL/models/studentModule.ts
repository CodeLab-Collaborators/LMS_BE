import { Schema, model } from "mongoose";
import { IStudentModule } from "../interface/studentTracks";

const studentModuleSchema: Schema<IStudentModule> = new Schema(
  {
    studentID: { type: String },
    courseID: { type: String },
    moduleID: { type: String },
    trackID: { type: String },
    status: { type: String },
    startDate: { type: String },
  },
  { versionKey: false }
);

const StudentModule = model<IStudentModule>(
  "StudentModule",
  studentModuleSchema
);
export default StudentModule;
