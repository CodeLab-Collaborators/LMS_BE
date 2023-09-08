"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const devError = (err, res) => {
    return res.status(AppError_1.HttpCode.NOT_FOUND).json({
        httpCode: err.httpCode,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const errorHandler = (err, req, res, next) => {
    devError(err, res);
};
exports.errorHandler = errorHandler;
