import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { successResponse, errorResponse } from "../../shared/utils/response";
import * as service from "./notifications-service";

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  
  const result = await service.getUserNotifications(userId, page);

  if(!result.notifications) {
    return errorResponse(res, "No notifications found");
  }
  
  return successResponse(
    res, 
    result.notifications,
    "Notifications fetched successfully",
    200,
    { unread_count: result.unread_count }
  );
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  
  const result = await service.readNotification(id as string, userId);

  if(!result) {
    return errorResponse(res, "Failed to mark notification as read");
  }
  
  return successResponse(res, null, "Notification marked as read");
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  
  const result = await service.readAllNotifications(userId);

  if(!result) {
    return errorResponse(res, "Failed to mark all notifications as read");
  }
  
  return successResponse(res, null, "All notifications marked as read");
});
