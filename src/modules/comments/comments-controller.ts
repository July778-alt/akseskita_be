import { Request, Response, NextFunction } from "express";
import { addCommentToReport, getReportComments, removeComment } from "./comments-service";
import { errorNotFound, errorResponse, successResponse } from "../../shared/utils/response";

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { reportId } = req.params;
    const { message } = req.body;
    const userId = req.user!.id;

    const comment = await addCommentToReport(reportId as string, userId, message);

    if (!comment) {
      return errorResponse(res, "Failed to add comment");
    }

    return successResponse(res, comment, "Comment added successfully", 201);
  } catch (error) {
    next(error);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { reportId } = req.params;
    const comments = await getReportComments(reportId as string);

    if (!comments) {
      return errorNotFound(res, "Comments not found");
    }

    return successResponse(res, comments, "Comments fetched successfully");
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const deleted = await removeComment(id as string, userId);

    if (!deleted) {
      return errorNotFound(res, "Comment not found or unauthorized");
    }

    return successResponse(res, null, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
}