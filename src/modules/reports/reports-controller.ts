import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { successResponse } from "../../shared/utils/response";
import {
  createReportService,
  getReportByIdService,
  getReportsService,
  deleteReportService,
  updateReportService,
  updateStatusService,
  getReportHistoriesService,
} from "./reports-service";

export const createReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const imageUrl = req.file?.path || undefined;

    const report = await createReportService(req.user?.id as string, {
      ...req.body,
      image_url: imageUrl,
    });

    successResponse(res, report, "Report created", 201);
  }
);

export const getReportsController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = { ...req.query };

    // If user is not staff, only allow them to see their own reports
    if (req.user?.role === "user") {
      query.user_id = req.user.id;
    }

    const { reports, pagination } = await getReportsService(query);

    successResponse(res, reports, "Reports retrieved", 200, {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      total_pages: pagination.total_pages,
    });
  }
);

export const getReportByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await getReportByIdService(req.params.id as string);

    successResponse(res, report);
  }
);

export const updateReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const image = req.file?.path || undefined;

    const report = await updateReportService(
      req.params.id as string,
      req.user?.id as string,
      req.user?.role as string,
      {
        ...req.body,
        image_url: image,
      }
    );

    successResponse(res, report, "Report updated");
  }
);

export const deleteReportController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteReportService(
      req.params.id as string,
      req.user?.id as string,
      req.user?.role as string
    );

    successResponse(res, null, "Report deleted");
  }
);

export const updateStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const report = await updateStatusService(
      req.params.id as string,
      req.body.status,
      req.user?.id as string
    );

    successResponse(res, report, "Status updated");
  }
);

export const getReportHistoriesController = asyncHandler(
  async (req: Request, res: Response) => {
    const histories = await getReportHistoriesService(req.params.id as string);

    successResponse(res, histories);
  }
);