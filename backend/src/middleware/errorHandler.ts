import { AppError } from "../errors";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
}
