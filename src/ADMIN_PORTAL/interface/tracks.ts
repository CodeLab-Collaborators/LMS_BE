import { Document } from "mongoose";

export interface ITracks extends Document {
  trackID: string;
  trackName: string;
  description?: string;
  price?: number;
}

export interface ITrackCourse extends Document {
  trackID: string;
  courseID: string;
}
