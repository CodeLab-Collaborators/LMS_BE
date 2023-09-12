"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./utils/errorHandler");
const AppError_1 = require("./utils/AppError");
const api_1 = __importDefault(require("./api"));
function appConfig(app) {
    app
        // middlewares
        .use(express_1.default.json())
        .use((0, cors_1.default)())
        .use((0, morgan_1.default)("dev"))
        // api routes
        .use("/api/v1", api_1.default)
        // catch 404 routes
        .all("*", (req, res, next) => {
        next();
        new AppError_1.AppError({
            message: `This route ${req.originalUrl} does not exist`,
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        });
    })
        // errorHandler
        .use(errorHandler_1.errorHandler);
}
exports.appConfig = appConfig;
