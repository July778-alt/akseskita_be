import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../shared/helpers/jwt";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = verifyToken(token) as {
      id: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}