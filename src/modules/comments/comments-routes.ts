import { Router } from "express";

import {
  createCommentController,
  deleteCommentController,
  getCommentsController,
} from "./comments-controller";

import { authMiddleware } from "../../middlewares/auth-middleware";

import { validate } from "../../middlewares/validate-middleware";

import { createCommentSchema } from "./comments-validation";

const router = Router();

router.get(
  "/report/:reportId",
  getCommentsController
);

router.post(
  "/report/:reportId",

  authMiddleware,

  validate(createCommentSchema),

  createCommentController
);

router.delete(
  "/:id",

  authMiddleware,

  deleteCommentController
);

export default router;