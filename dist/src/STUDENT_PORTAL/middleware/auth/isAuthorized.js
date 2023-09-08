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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globalFunctions_1 = require("../../../utils/globalFunctions");
const AppError_1 = require("../../../utils/AppError");
const envVariable_1 = require("../../../../config/envVariable");
const auth_1 = __importDefault(require("../../models/auth"));
exports.isAuthorized = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const authHeaders = (req && req.headers.authorization) || (req && req.headers.Authorization);
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
        next(new AppError_1.AppError({
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
            message: "Invalid Bearer",
        }));
    }
    const token = (authHeaders && authHeaders.split(" ")[1]) ||
        ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.authToken) ||
        ((_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken) ||
        "";
    if (!token)
        next(new AppError_1.AppError({
            message: "Invalid token",
            httpCode: AppError_1.HttpCode.UNAUTHORIZED,
        }));
    jsonwebtoken_1.default.verify(token, envVariable_1.envVariable.ACCESS_TOKEN_SECRET_KEY, (err, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
        // check for errors
        if (err) {
            const errorMsg = err.name === "JsonWebTokenError"
                ? "Auth Failed (Unauthorized)"
                : err.message;
            next(new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                message: errorMsg,
            }));
        }
        //decode user if verified
        const verifiedUser = yield auth_1.default.findOne({
            _id: decodedUser.studentID,
        }).select("-password -confirmPassword");
        if (!verifiedUser) {
            next(new AppError_1.AppError({
                httpCode: AppError_1.HttpCode.UNAUTHORIZED,
                message: "Unauthorized user",
            }));
        }
        //requesting for the authorized User
        req.user = verifiedUser;
        // if Successful move to the next middleware
        next();
    }));
}));
