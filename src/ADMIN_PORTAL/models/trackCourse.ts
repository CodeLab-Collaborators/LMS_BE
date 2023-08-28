import { model, Schema } from "mongoose";
import { ITrackCourse } from "../interface/tracks";

const trackCourseSchema: Schema<ITrackCourse> = new Schema(
  {
    trackID: { type: String },
    courseID: { type: String },
  },
  { versionKey: false }
);

const TrackCourse = model<ITrackCourse>("TrackCourse", trackCourseSchema);
export default TrackCourse;
