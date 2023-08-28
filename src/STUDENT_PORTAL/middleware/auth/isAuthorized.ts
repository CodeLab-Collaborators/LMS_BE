import { NextFunction, Response, Request } from "express";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import { IAuthRequest, IStudent } from "../../interface";
import { asyncHandler } from "../../../utils/globalFunctions";
import { AppError, HttpCode } from "../../../utils/AppError";
import { envVariable } from "../../../../config/envVariable";
import Student from "../../models/auth";

export const isAuthorized = asyncHandler(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const authHeaders =
      (req && req.headers.authorization) || (req && req.headers.Authorization);

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      next(
        new AppError({
          httpCode: HttpCode.UNAUTHORIZED,
          message: "Invalid Bearer",
        })
      );
    }
    const token =
      (authHeaders && authHeaders.split(" ")[1]) ||
      req?.cookies?.authToken ||
      req?.cookies?.accessToken ||
      "";
    if (!token)
      next(
        new AppError({
          message: "Invalid token",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    jwt.verify(
      token,
      envVariable.ACCESS_TOKEN_SECRET_KEY as Secret,
      async (err: VerifyErrors | null, decodedUser: any) => {
        // check for errors
        if (err) {
          const errorMsg =
            err.name === "JsonWebTokenError"
              ? "Auth Failed (Unauthorized)"
              : err.message;
          next(
            new AppError({
              httpCode: HttpCode.UNAUTHORIZED,
              message: errorMsg,
            })
          );
        }

        //decode user if verified
        const verifiedUser = await Student.findOne({
          _id: decodedUser!.studentID,
        }).select("-password -confirmPassword");

        if (!verifiedUser) {
          next(
            new AppError({
              httpCode: HttpCode.UNAUTHORIZED,
              message: "Unauthorized user",
            })
          );
        }

        //requesting for the authorized User
        req.user = verifiedUser as IStudent;
        // if Successful move to the next middleware
        next();
      }
    );
  }
);
