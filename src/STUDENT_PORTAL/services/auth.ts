import { NextFunction, Response, Request } from "express";
import Student from "../models/auth";
import { asyncHandler, creationDate } from "../../utils/globalFunctions";
import TokenModel from "../models/token";
import { generate } from "randomstring";
import { SignOptions, Secret } from "jsonwebtoken";
import { envVariable } from "../../../config/envVariable";
import { AppError, HttpCode } from "../../utils/AppError";
import { verifyUserEmail } from "../../utils/mailer";
import { AuthenticatedRequestBody, IStudent } from "../interface/auth";

export const registerService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword, firstName, lastName } =
      req.body || {};

    const newUser = new Student({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      studentID: generate(6),
      createdAt: creationDate(),
    });

    const user = await newUser.save();

    let token = new TokenModel({ studentID: user.studentID });

    const payload = {
      studentID: user.studentID!,
    };

    const accessTokenSecretKey = envVariable.ACCESS_TOKEN_SECRET_KEY as Secret;
    const accessTokenOptions: SignOptions = {
      expiresIn: envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME,
      issuer: envVariable.JWT_ISSUER,
      audience: String(user.studentID),
    };

    const refreshTokenSecretKey =
      envVariable.REFRESH_TOKEN_SECRET_KEY as Secret;
    const refreshTokenOptions: SignOptions = {
      expiresIn: envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME,
      issuer: envVariable.JWT_ISSUER,
      audience: String(user.studentID),
    };

    const generateAccessToken = await token.generateToken(
      payload,
      accessTokenSecretKey,
      accessTokenOptions
    );
    const generateRefreshToken = await token.generateToken(
      payload,
      refreshTokenSecretKey,
      refreshTokenOptions
    );

    token!.refreshToken = generateRefreshToken;
    token!.accessToken = generateAccessToken;
    token = await token.save();

    const verifyEmailLink = `${envVariable.WEBSITE_URL}/verify-email/${user.studentID}/${token.refreshToken}`;

    // // send email for verification
    const verifyingUser = {
      email: user!.email,
      id: user!.studentID,
      status: user!.status,
      link: verifyEmailLink,
    };
    await verifyUserEmail(verifyingUser).then(() =>
      console.log(`Email has been sent to ${user!.email}`)
    );

    const data = {
      user: {
        accessToken: token!.accessToken,
        refreshToken: token!.refreshToken,
      },
    };

    return res.status(201).json({
      message: `Email has been sent to ${user!.email}`,
      data,
    });
  }
);

export const verifyEmailService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await Student.findById(req.params.studentID);

    if (!user)
      next(
        new AppError({
          message:
            "Email verification token is invalid or has expired. Please click on resend for verify your Email.",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    //User is already verified
    if (user!.isEmailVerified && user!.status === "active") {
      return res.status(200).json({
        message: "Your email is already verified, Please Login",
      });
    }
    const emailVerificationToken = await TokenModel.findOne({
      studentID: user!.studentID,
      refreshToken: req.params.token,
    });

    if (!emailVerificationToken)
      next(
        new AppError({
          message: "Email verification token is invalid or has expired.",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );

    // Verify the user
    user!.isEmailVerified = true;
    await user!.save();
    await emailVerificationToken?.deleteOne();

    return res.status(200).json({
      status: "success",
      message:
        "Your account has been successfully verified . Please proceed to create your profile.",
    });
  }
);

export const loginService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await Student.findOne({ email });

    if (!user)
      next(
        new AppError({
          message: "This email and password does not exist",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    const checkPassword = await user!.comparePassword(password);
    if (!checkPassword)
      next(
        new AppError({
          message: "This email and password does not exist",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    let token = await TokenModel.findOne({ studentID: user!.studentID });

    if (!token) {
      token = new TokenModel({ studentID: user!.studentID });
      token = await token.save();
    }

    // Generate access and refresh token
    const generatedAccessToken = await token!.generateToken(
      { studentID: user!.studentID! },
      envVariable.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable.JWT_ISSUER,
        audience: String(user!.studentID),
      }
    );
    const generatedRefreshToken = await token!.generateToken(
      { studentID: user!.studentID! },
      envVariable.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable.JWT_ISSUER,
        audience: String(user!.studentID),
      }
    );

    //save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = await token.save();

    // check if user verified
    if (!user!.isEmailVerified || user!.status !== "active") {
      const verifyEmailLink = `${envVariable.WEBSITE_URL}/verify-email?id=${
        user!.studentID
      }&token=${token.refreshToken}`;

      // // send email for verification
      const verifyingUser = {
        email: user!.email,
        id: user!._id,
        status: user!.status,
        link: verifyEmailLink,
      };
      // await verifyUserEmail(verifyingUser).then(() =>
      //   console.log(`Email has been sent to${user!.email}`)
      // );

      const data = {
        user: {
          accessToken: token!.accessToken,
          refreshToken: token!.refreshToken,
        },
      };

      return res.status(401).json({
        message:
          "Your account is not verified, a verification code has been sent to your email",
        data,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      password: pass,
      confirmPassword,
      isEmailVerified,
      status,
      ...otherUserInfo
    } = user!._doc;

    const data = {
      accessToken: token!.accessToken,
      refreshToken: token!.refreshToken,
      user: otherUserInfo,
    };

    // set cookies
    res.cookie("accessToken", token!.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // a day
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", token!.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Success",
      data,
    });
  }
);

export const updateStudentProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      profileImage,
      gender,
      mobileNumber,
      country_of_residence,
      state_of_residence,
      address,
      dateOfBirth,
    } = req.body;

    const user = await Student.findById(req.params.studentID);
    if (!user) {
      next(
        new AppError({
          message: "Please sign up you have not been verified",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    user!.firstName = firstName || user!.firstName;
    user!.lastName = lastName || user!.lastName;
    user!.gender = gender || user!.gender;
    user!.dateOfBirth = dateOfBirth || user!.dateOfBirth;
    user!.mobileNumber = mobileNumber || user!.mobileNumber;
    user!.address = address || user!.address;
    user!.country_of_residence =
      country_of_residence || user!.country_of_residence;
    user!.state_of_residence = state_of_residence || user!.state_of_residence;
    user!.profileImage =
      firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

    const profileUpdate = await user!.save({ validateBeforeSave: false });

    if (!profileUpdate)
      next(
        new AppError({
          message: "Update failed",
          httpCode: HttpCode.UNPROCESSABLE_IDENTITY,
        })
      );

    const {
      password: pass,
      confirmPasword,
      isEmailVerified,
      status,
      ...otherUserInfo
    } = profileUpdate!._doc;

    res.status(200).json({
      message: "profile update was Successful",
      data: otherUserInfo,
    });
  }
);

export const getStudentProfileService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IStudent>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await Student.findById(req!.user!.studentID);

    if (!user)
      next(
        new AppError({
          message: "You are not authorized",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );

    const {
      password: pass,
      confirmPassword,
      isEmailVerified,
      status,
      ...otherUserInfo
    } = user!._doc;

    return res.status(200).json({
      message: "Success",
      data: otherUserInfo,
    });
  }
);
