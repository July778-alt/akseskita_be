import { NextFunction, Request, Response } from "express";

export function roleMiddleware(
  allowedRoles: string[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const hasAccess =
      allowedRoles.includes(user.role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
}