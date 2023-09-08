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
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariable = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.envVariable = {
    PORT: process.env.PORT,
    MONGODB_LOCALHOST: process.env.MONGODB_LOCALHOST,
    MONGODB_CLOUD: process.env.MONGODB_CLOUD,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_KEY_EXPIRE_TIME: process.env.ACCESS_TOKEN_KEY_EXPIRE_TIME,
    REFRESH_TOKEN_KEY_EXPIRE_TIME: process.env.REFRESH_TOKEN_KEY_EXPIRE_TIME,
    RESET_PASSWORD_EXPIRE_TIME: process.env.RESET_PASSWORD_EXPIRE_TIME,
    JWT_ISSUER: process.env.JWT_ISSUER,
    WEBSITE_URL: process.env.WEBSITE_URL,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_REFRESHTOKEN: process.env.GOOGLE_REFRESHTOKEN,
    GOOGLE_REDIRECT: process.env.GOOGLE_REDIRECT,
    PASSPORT_GOOGLE_CLIENT_ID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    PASSPORT_GOOGLE_CLIENT_SECRET: process.env
        .PASSPORT_GOOGLE_CLIENT_SECRET,
};
