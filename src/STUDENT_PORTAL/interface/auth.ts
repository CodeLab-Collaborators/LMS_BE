import { Document, Schema } from "mongoose";
import { Request } from "express";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  status?: string;
  profileImage?: string;
  mobileNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  token?: string;
  country_of_residence: string;
  state_of_residence: string;
  accessToken?: string;
  refreshToken?: string;
  studentID?: string;
  createdAt?: string;
  isEmailVerified?: boolean;
  _doc: any;
}

export interface IStudentToken {
  emailVerificationExpiresToken?: string;
  emailVerificationToken?: string;
  resetPasswordExpires?: string;
  resetPasswordToken?: string;
  studentID: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string; accessToken?: string; refreshToken?: string };
  user?: IStudent;
}

export interface AuthenticatedRequestBody<T> extends Request {
  body: T;
  user?: IStudent;
}
