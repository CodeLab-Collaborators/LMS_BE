import { Schema, Document, model } from "mongoose";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import { IStudentToken } from "../interface/auth";

export interface IStudentTokenDocument extends Document, IStudentToken {
  generatePasswordReset(): Promise<void>;
  generateEmailVerificationToken(): Promise<void>;
  generateToken(
    payload: { studentID: string },
    secret: jwt.Secret,
    signOptions: jwt.SignOptions
  ): Promise<string>;
}

export const studentTokenSchema: Schema<IStudentTokenDocument> = new Schema(
  {
    studentID: {
      type: String,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    emailVerificationToken: {
      type: String,
      required: false,
    },
    emailVerificationExpiresToken: {
      type: Date,
      required: false,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

// Generate Refresh/Access Token
studentTokenSchema.methods.generateToken = function (
  payload: { studentID: string },
  secret: string,
  signOptions: any
): Promise<string> {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      payload,
      secret,
      signOptions,
      (err: Error | null, encoded: string | undefined) => {
        if (err === null && encoded !== undefined) {
          resolve(encoded);
        } else {
          reject(err);
        }
      }
    );
  });
};

// Generate email verification token
studentTokenSchema.methods.generateEmailVerificationToken = function () {
  this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationExpiresToken = Date.now() + 3600000; // expires in an hour
};

// Generate Password Reset
studentTokenSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

studentTokenSchema.post("save", function () {
  console.log("Token is been Saved ", this);
});

const TokenModel = model<IStudentTokenDocument>(
  "StudentToken",
  studentTokenSchema
);
export default TokenModel;
