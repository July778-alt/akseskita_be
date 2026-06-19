import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger";

/**
 * Global Error Handler Middleware
 */
export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "Internal Server Error";
  let errors: any = undefined;

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = error.flatten().fieldErrors;
  }

  // Handle DB errors
  if (error.code === "23505") {
    statusCode = 409;
    message = "Conflict: Resource already exists";
  }

  // Log server errors for debugging
  if (statusCode === 500) {
    logger.error(`[Server Error] ${req.method} ${req.path}:`, error);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
}