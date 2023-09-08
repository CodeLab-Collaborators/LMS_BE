"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProfileService = exports.updateStudentProfile = exports.loginService = exports.verifyEmailService = exports.registerService = void 0;
const auth_1 = __importDefault(require("../models/auth"));
const globalFunctions_1 = require("../../utils/globalFunctions");
const token_1 = __importDefault(require("../models/token"));
const randomstring_1 = require("randomstring");
const envVariable_1 = require("../../../config/envVariable");
const AppError_1 = require("../../utils/AppError");
const mailer_1 = require("../../utils/mailer");
exports.registerService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword, firstName, lastName } = req.body || {};
    const newUser = new auth_1.default({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        studentID: (0, randomstring_1.generate)(6),
        createdAt: (0, globalFunctions_1.creationDate)(),
    });
    const user = yield newUser.save();
    let token = new token_1.default({ studentID: user.studentID });
    const payload = {
        studentID: user.studentID,
    };
    const accessTokenSecretKey = envVariable_1.envVariable.ACCESS_TOKEN_SECRET_KEY;
    const accessTokenOptions = {
        expiresIn: envVariable_1.envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable_1.envVariable.JWT_ISSUER,
        audience: String(user.studentID),
    };
    const refreshTokenSecretKey = envVariable_1.envVariable.REFRESH_TOKEN_SECRET_KEY;
    const refreshTokenOptions = {
        expiresIn: envVariable_1.envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable_1.envVariable.JWT_ISSUER,
        audience: String(user.studentID),
    };
    const generateAccessToken = yield token.generateToken(payload, accessTokenSecretKey, accessTokenOptions);
    const generateRefreshToken = yield token.generateToken(payload, refreshTokenSecretKey, refreshTokenOptions);
    token.refreshToken = generateRefreshToken;
    token.accessToken = generateAccessToken;
    token = yield token.save();
    const verifyEmailLink = `${envVariable_1.envVariable.WEBSITE_URL}/verify-email/${user.studentID}/${token.refreshToken}`;
    // // send email for verification
    const verifyingUser = {
        email: user.email,
        id: user.studentID,
        status: user.status,
        link: verifyEmailLink,
    };
    yield (0, mailer_1.verifyUserEmail)(verifyingUser).then(() => console.log(`Email has been sent to ${user.email}`));
    const data = {
        user: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        },
    };
    return res.status(201).json({
        message: `Email has been sent to ${user.email}`,
        data,
    });
}));
exports.verifyEmailService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_1.default.findById(req.params.studentID);
    if (!user)
        next(new AppError_1.AppError({
            message: "Email verification token is invalid or has expired. Please click on resend for verify your Email.",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    //User is already verified
    if (user.isEmailVerified && user.status === "active") {
        return res.status(200).json({
            message: "Your email is already verified, Please Login",
        });
    }
    const emailVerificationToken = yield token_1.default.findOne({
        studentID: user.studentID,
        refreshToken: req.params.token,
    });
    if (!emailVerificationToken)
        next(new AppError_1.AppError({
            message: "Email verification token is invalid or has expired.",
            httpCode: AppError_1.HttpCode.BAD_REQUEST,
        }));
    // Verify the user
    user.isEmailVerified = true;
    yield user.save();
    yield (emailVerificationToken === null || emailVerificationToken === void 0 ? void 0 : emailVerificationToken.deleteOne());
    return res.status(200).json({
        status: "success",
        message: "Your account has been successfully verified . Please proceed to create your profile.",
    });
}));
exports.loginService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield auth_1.default.findOne({ email });
    if (!user)
        next(new AppError_1.AppError({
            message: "This email and password does not exist",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
        }));
    const checkPassword = yield user.comparePassword(password);
    if (!checkPassword)
        next(new AppError_1.AppError({
            message: "This email and password does not exist",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
        }));
    let token = yield token_1.default.findOne({ studentID: user.studentID });
    if (!token) {
        token = new token_1.default({ studentID: user.studentID });
        token = yield token.save();
    }
    // Generate access and refresh token
    const generatedAccessToken = yield token.generateToken({ studentID: user.studentID }, envVariable_1.envVariable.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: envVariable_1.envVariable.ACCESS_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable_1.envVariable.JWT_ISSUER,
        audience: String(user.studentID),
    });
    const generatedRefreshToken = yield token.generateToken({ studentID: user.studentID }, envVariable_1.envVariable.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: envVariable_1.envVariable.REFRESH_TOKEN_KEY_EXPIRE_TIME,
        issuer: envVariable_1.envVariable.JWT_ISSUER,
        audience: String(user.studentID),
    });
    //save the updated token
    token.refreshToken = generatedRefreshToken;
    token.accessToken = generatedAccessToken;
    token = yield token.save();
    // check if user verified
    if (!user.isEmailVerified || user.status !== "active") {
        const verifyEmailLink = `${envVariable_1.envVariable.WEBSITE_URL}/verify-email?id=${user.studentID}&token=${token.refreshToken}`;
        // // send email for verification
        const verifyingUser = {
            email: user.email,
            id: user._id,
            status: user.status,
            link: verifyEmailLink,
        };
        // await verifyUserEmail(verifyingUser).then(() =>
        //   console.log(`Email has been sent to${user!.email}`)
        // );
        const data = {
            user: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            },
        };
        return res.status(401).json({
            message: "Your account is not verified, a verification code has been sent to your email",
            data,
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = user._doc, { password: pass, confirmPassword, isEmailVerified, status } = _a, otherUserInfo = __rest(_a, ["password", "confirmPassword", "isEmailVerified", "status"]);
    const data = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: otherUserInfo,
    };
    // set cookies
    res.cookie("accessToken", token.accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({
        message: "Success",
        data,
    });
}));
exports.updateStudentProfile = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, profileImage, gender, mobileNumber, country_of_residence, state_of_residence, address, dateOfBirth, } = req.body;
    const user = yield auth_1.default.findById(req.params.studentID);
    if (!user) {
        next(new AppError_1.AppError({
            message: "Please sign up you have not been verified",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.address = address || user.address;
    user.country_of_residence =
        country_of_residence || user.country_of_residence;
    user.state_of_residence = state_of_residence || user.state_of_residence;
    user.profileImage =
        firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    const profileUpdate = yield user.save({ validateBeforeSave: false });
    if (!profileUpdate)
        next(new AppError_1.AppError({
            message: "Update failed",
            httpCode: AppError_1.HttpCode.UNPROCESSABLE_IDENTITY,
        }));
    const _b = profileUpdate._doc, { password: pass, confirmPasword, isEmailVerified, status } = _b, otherUserInfo = __rest(_b, ["password", "confirmPasword", "isEmailVerified", "status"]);
    res.status(200).json({
        message: "profile update was Successful",
        data: otherUserInfo,
    });
}));
exports.getStudentProfileService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_1.default.findById(req.user.studentID);
    if (!user)
        next(new AppError_1.AppError({
            message: "You are not authorized",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
        }));
    const _c = user._doc, { password: pass, confirmPassword, isEmailVerified, status } = _c, otherUserInfo = __rest(_c, ["password", "confirmPassword", "isEmailVerified", "status"]);
    return res.status(200).json({
        message: "Success",
        data: otherUserInfo,
    });
}));
