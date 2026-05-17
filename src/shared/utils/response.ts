import { Response } from "express";

/**
 * Standard Success Response
 */
export function successResponse(
  res: Response,
  data: any,
  message = "Operation successful",
  statusCode = 200,
  meta?: any
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
}

/**
 * Standard Error Response
 */
export function errorResponse(
  res: Response,
  message = "An error occurred",
  statusCode = 500,
  errors?: any
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

export function errorNotFound(
  res: Response,
  message = "Not Found",
  statusCode = 404
) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
