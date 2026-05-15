import { Router } from "express";

import { getDashboardController } from "./dashboard-controller";

import { authMiddleware } from "../../middlewares/auth-middleware";

import { roleMiddleware } from "../../middlewares/role-middleware";

const router = Router();

router.get(
  "/",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  getDashboardController
);

export default router;