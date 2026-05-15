import { Request, Response } from "express";

import asyncHandler from "../../shared/helpers/async-handler";

import { successResponse } from "../../shared/helpers/response";

import {
  createCommentService,
  deleteCommentService,
  getCommentsService,
} from "./comments-service";

export const createCommentController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const comment =
        await createCommentService(
          req.params.reportId as string,

          req.user?.id as string,

          req.body.message
        );

      successResponse(
        res,
        comment,
        "Comment created",
        201
      );
    }
  );

export const getCommentsController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const comments =
        await getCommentsService(
          req.params.reportId as string
        );

      successResponse(
        res,
        comments
      );
    }
  );

export const deleteCommentController =
  asyncHandler(
    async (req: Request, res: Response) => {
      await deleteCommentService(
        req.params.id as string,

        req.user?.id as string,

        req.user?.role as string
      );

      successResponse(
        res,
        null,
        "Comment deleted"
      );
    }
  );