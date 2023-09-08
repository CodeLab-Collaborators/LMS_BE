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
exports.studentTokenSchema = void 0;
const mongoose_1 = require("mongoose");
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
exports.studentTokenSchema = new mongoose_1.Schema({
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
}, { versionKey: false });
// Generate Refresh/Access Token
exports.studentTokenSchema.methods.generateToken = function (payload, secret, signOptions) {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, secret, signOptions, (err, encoded) => {
            if (err === null && encoded !== undefined) {
                resolve(encoded);
            }
            else {
                reject(err);
            }
        });
    });
};
// Generate email verification token
exports.studentTokenSchema.methods.generateEmailVerificationToken = function () {
    this.emailVerificationToken = crypto.randomBytes(32).toString("hex");
    this.emailVerificationExpiresToken = Date.now() + 3600000; // expires in an hour
};
// Generate Password Reset
exports.studentTokenSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};
exports.studentTokenSchema.post("save", function () {
    console.log("Token is been Saved ", this);
});
const TokenModel = (0, mongoose_1.model)("StudentToken", exports.studentTokenSchema);
exports.default = TokenModel;
