import { Document } from "mongoose";

export interface IStudentTrack extends Document {
  trackID: string;
  studentID: string;
  status: string;
  dateEnrolled: string;
  completion_average: number;
}

export interface IStudentCourse extends Document {
  courseID: string;
  trackID: string;
  studentID: string;
  status: string;
  startdate: string;
  completion_average: number;
}
export interface IStudentModule extends Document {
  courseID: string;
  trackID: string;
  moduleID: string;
  studentID: string;
  status: string;
  startDate: string;
}
