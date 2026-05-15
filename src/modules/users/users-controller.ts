import { Request, Response } from "express";

import asyncHandler from "../../shared/helpers/async-handler";

import { successResponse } from "../../shared/helpers/response";

import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateProfileService,
} from "./users-service";

export const getUsersController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const users =
        await getUsersService();

      successResponse(
        res,
        users
      );
    }
  );

  export const getCurrentUserController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const user =
        await getUserByIdService(
          req.user?.id as string
        );

      successResponse(
        res,
        user
      );
    }
  );

  export const updateProfileController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const avatar =
        req.file?.path || undefined;

      const user =
        await updateProfileService(
          req.user?.id as string,

          {
            ...req.body,

            profile_picture:
              avatar,
          }
        );

      successResponse(
        res,
        user,
        "Profile updated"
      );
    }
  );

  export const deleteUserController =
  asyncHandler(
    async (req: Request, res: Response) => {
      await deleteUserService(
        req.params.id as string
      );

      successResponse(
        res,
        null,
        "User deleted"
      );
    }
  );