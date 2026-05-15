import { Request, Response } from "express";

import asyncHandler from "../../shared/helpers/async-handler";

import {
  loginService,
  meService,
  registerService,
} from "./auth-service";

import { successResponse } from "../../shared/helpers/response";

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

export const meController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const user = await meService(
        req.user?.id as string
      );

    successResponse(
        res,
        user
      );
    }
  );