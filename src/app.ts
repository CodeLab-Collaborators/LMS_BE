import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./utils/errorHandler";
import { AppError, HttpCode } from "./utils/AppError";
import api from "./api";

export function appConfig(app: Application) {
  app
    // middlewares
    .use(express.json())
    .use(cors())
    .use(morgan("dev"))

    // api routes
    .use("/api/v1", api)
    // catch 404 routes
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      next();
      new AppError({
        message: `This route ${req.originalUrl} does not exist`,
        httpCode: HttpCode.NOT_FOUND,
      });
    })
    // errorHandler
    .use(errorHandler);
}
