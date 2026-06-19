import { Request, Response } from "express";

import { asyncHandler } from "../../shared/utils/async-handler";

import {
  loginService,
  registerService,
} from "./auth-service";

import { successResponse } from "../../shared/utils/response";

export const registerController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const result = await registerService(
        req.body
      );

    successResponse(
        res,
        result,
        "Register success",
        201
      );
    }
  );

export const loginController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const result = await loginService(
        req.body
      );

    successResponse(
        res,
        result,
        "Login success"
      );
    }
  );