import { Request, Response } from "express";

import { asyncHandler } from "../../shared/utils/async-handler";

import { successResponse } from "../../shared/utils/response";

import { getDashboardService } from "./dashboard-service";

export const getDashboardController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const dashboard =
        await getDashboardService();

      successResponse(
        res,
        dashboard
      );
    }
  );