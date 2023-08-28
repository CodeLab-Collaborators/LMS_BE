import { model, Schema } from "mongoose";
import { ICourseModule } from "../interface/courses";

const CourseModuleSchema: Schema<ICourseModule> = new Schema(
  {
    moduleID: { type: String },
    courseID: { type: String },
    created: { type: Date },
  },
  { versionKey: false }
);

const CourseModule = model<ICourseModule>("CourseModule", CourseModuleSchema);
export default CourseModule;
