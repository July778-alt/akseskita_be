import { Router } from "express";

import {
  deleteUserController,
  getCurrentUserController,
  getUsersController,
  updateProfileController,
} from "./users-controller";

import { authMiddleware } from "../../middlewares/auth-middleware";

import { roleMiddleware } from "../../middlewares/role-middleware";

import { validate } from "../../middlewares/validate-middleware";

import { updateProfileSchema } from "./users-validation";

import { upload } from "../../config/multer";

const router = Router();

router.get(
  "/me",

  authMiddleware,

  getCurrentUserController
);

router.put(
  "/me",

  authMiddleware,

  upload.single("avatar"),

  validate(updateProfileSchema),

  updateProfileController
);

router.get(
  "/",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  getUsersController
);

router.delete(
  "/:id",

  authMiddleware,

  roleMiddleware([
    "super_admin",
  ]),

  deleteUserController
);

export default router;