import { Router } from "express";

import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./categories-controller";

import { authMiddleware } from "../../middlewares/auth-middleware";

import { roleMiddleware } from "../../middlewares/role-middleware";

import { validate } from "../../middlewares/validate-middleware";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./categories-validation";

const router = Router();

router.get(
  "/",
  getCategoriesController
);

router.get(
  "/:id",
  getCategoryByIdController
);

router.post(
  "/",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  validate(createCategorySchema),

  createCategoryController
);

router.put(
  "/:id",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  validate(updateCategorySchema),

  updateCategoryController
);

router.delete(
  "/:id",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  deleteCategoryController
);

export default router;