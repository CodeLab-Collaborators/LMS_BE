import { Schema, model } from "mongoose";
import { IStudentTrack } from "../interface/studentTracks";

const studentTrackSchema: Schema<IStudentTrack> = new Schema(
  {
    trackID: { type: String },
    studentID: { type: String },
    status: { type: String },
    completion_average: { type: Number },
    dateEnrolled: { type: String },
    total_courses: { type: Number },
  },
  { versionKey: false }
);

const StudentTrack = model<IStudentTrack>("StudentTrack", studentTrackSchema);
export default StudentTrack;
