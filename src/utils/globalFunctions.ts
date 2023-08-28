import { Request, Response, NextFunction } from "express";

export function creationDate() {
  let day = new Date().toDateString();
  let time = new Date().toLocaleTimeString();
  return day + " " + time;
}

export const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
