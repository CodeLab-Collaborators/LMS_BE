import { Document } from "mongoose";

export interface ICourses extends Document {
  courseID: string;
  title: string;
  description: string;
  imgCover: string;
  created: Date;
}

export interface ICourseModule extends Document {
  moduleID: string;
  courseID: string;
  created: Date;
}

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface ICourseAssessment extends Document {
  courseID: string;
  assessmentID: string;
  title: string;
  description?: string;
  questions: IQuestion[];
}
