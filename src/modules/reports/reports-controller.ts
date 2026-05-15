import { Request, Response } from "express";

import asyncHandler from "../../shared/helpers/async-handler";

import { successResponse } from "../../shared/helpers/response";

import {
  createReportService,
  getReportByIdService,
  getReportsService,
  deleteReportService,
  updateReportService,
  updateStatusService,
  getReportHistoriesService,
} from "./reports-service";

export const createReportController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const report =
        await createReportService(
          req.user?.id as string,
          req.body
        );

    successResponse(
        res,
        report,
        "Report created",
        201
      );
    }
  );

export const getReportsController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const reports =
        await getReportsService(
          req.query
        );

      successResponse(
        res,
        reports
      );
    }
  );

export const getReportByIdController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const report =
        await getReportByIdService(
          req.params.id as string,
        );

    successResponse(
        res,
        report
      );
    }
  );

export const updateReportController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const image =
        req.file?.path || undefined;

      const report =
        await updateReportService(
          req.params.id as string,

          req.user?.id as string,

          req.user?.role as string,

          {
            ...req.body,
            image_url: image,
          }
        );

      successResponse(
        res,
        report,
        "Report updated"
      );
    }
  );

export const deleteReportController =
  asyncHandler(
    async (req: Request, res: Response) => {
      await deleteReportService(
        req.params.id as string,

        req.user?.id as string,

        req.user?.role as string
      );

      successResponse(
        res,
        null,
        "Report deleted"
      );
    }
  );

  export const updateStatusController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const report =
        await updateStatusService(
          req.params.id as string,

          req.body.status,

          req.user?.id as string
        );

      successResponse(
        res,
        report,
        "Status updated"
      );
    }
  );

export const getReportHistoriesController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const histories =
        await getReportHistoriesService(
          req.params.id as string
        );

      successResponse(
        res,
        histories
      );
    }
  );