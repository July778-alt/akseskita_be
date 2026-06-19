import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { successResponse } from "../../shared/utils/response";
import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateProfileService,
  updateRoleService,
} from "./users-service";

export const updateRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const user = await updateRoleService(id, role);

    successResponse(res, user, "User role updated successfully");
  }
);

export const getUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = { ...req.query };
    
    const { users, pagination } = await getUsersService(query);

    successResponse(res, users, "Users retrieved", 200, {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      total_pages: pagination.total_pages,
    });
  }
);

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getUserByIdService(req.user?.id as string);

    successResponse(res, user);
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const avatar = req.file?.path || undefined;

    const user = await updateProfileService(req.user?.id as string, {
      ...req.body,
      profile_picture: avatar,
    });

    successResponse(res, user, "Profile updated");
  }
);

export const deleteUserController = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteUserService(
      req.params.id as string,
      req.user?.id as string,
      req.user?.role as string
    );

    successResponse(res, null, "User deleted");
  }
);