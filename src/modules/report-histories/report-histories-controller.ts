import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { successResponse } from "../../shared/utils/response";
import { getReportHistoriesService } from "./report-histories-service";

export const getReportHistoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const histories = await getReportHistoriesService(req.params.id as string);

    successResponse(res, histories);
  }
);
