import { Request, Response } from "express";

import { asyncHandler } from "../../shared/utils/async-handler";

import { successResponse } from "../../shared/utils/response";

import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  updateCategoryService,
} from "./categories-service";

export const createCategoryController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const category =
        await createCategoryService(
          req.body
        );

      successResponse(
        res,
        category,
        "Category created",
        201
      );
    }
  );

export const getCategoriesController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const categories =
        await getCategoriesService();

      successResponse(
        res,
        categories
      );
    }
  );

export const updateCategoryController =
  asyncHandler(
    async (req: Request, res: Response) => {
      const category =
        await updateCategoryService(
          req.params.id as string,
          req.body
        );

      successResponse(
        res,
        category,
        "Category updated"
      );
    }
  );

export const deleteCategoryController =
  asyncHandler(
    async (req: Request, res: Response) => {
      await deleteCategoryService(
        req.params.id as string
      );

      successResponse(
        res,
        null,
        "Category deleted"
      );
    }
  );