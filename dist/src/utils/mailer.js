"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sendConfirmResetPasswordEmail = exports.sendResetPasswordEmail = exports.verifyUserEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const ejs_1 = __importDefault(require("ejs"));
const path = __importStar(require("path"));
const envVariable_1 = require("../../config/envVariable");
const GOOGLE_SECRET = envVariable_1.envVariable.GOOGLE_SECRET;
const GOOGLE_ID = envVariable_1.envVariable.GOOGLE_ID;
const GOOGLE_REFRESHTOKEN = envVariable_1.envVariable.GOOGLE_REFRESHTOKEN;
const GOOGLE_REDIRECT = envVariable_1.envVariable.GOOGLE_REDIRECT;
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });
const verifyUserEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "adedejiomogbehin@gmail.com",
                refreshToken: accessToken.token,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: GOOGLE_REFRESHTOKEN,
            },
        });
        const buildFile = path.join(__dirname, "../views/verifyAccount.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            email: user.email,
            id: user._id,
            status: user.status,
            link: user.link,
        });
        const mailOptions = {
            from: "Your registration to VON <adanianlabs>",
            to: user.email,
            subject: "Account Verification Email",
            html: data,
        };
        transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
    }
});
exports.verifyUserEmail = verifyUserEmail;
const sendResetPasswordEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "adedejiomogbehin@gmail.com",
                refreshToken: accessToken.token,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: GOOGLE_REFRESHTOKEN,
            },
        });
        const buildFile = path.join(__dirname, "../views/passwordReset.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            email: user.email,
            id: user._id,
            status: user.status,
            link: user.link,
        });
        const mailOptions = {
            from: "This link is to reset your password <LMS>",
            to: user.email,
            subject: " Password reset Token",
            html: data,
        };
        transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const sendConfirmResetPasswordEmail = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "adedejiomogbehin@gmail.com",
                refreshToken: accessToken.token,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: GOOGLE_REFRESHTOKEN,
            },
        });
        const buildFile = path.join(__dirname, "../views/forgotPassword.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            email: user.email,
            id: user._id,
            status: user.status,
            link: user.link,
        });
        const mailOptions = {
            from: "This link is to reset your password <LMS>",
            to: user.email,
            subject: "Reset your password",
            html: data,
        };
        transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendConfirmResetPasswordEmail = sendConfirmResetPasswordEmail;
