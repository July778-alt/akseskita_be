import {
  NextFunction,
  Request,
  Response,
} from "express";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  return res.status(error.status || 500).json({
    success: false,

    message:
      error.message ||
      "Internal Server Error",
  });
}