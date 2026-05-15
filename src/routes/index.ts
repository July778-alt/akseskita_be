import { Router } from "express";
import authRoutes from "../modules/auth/auth-routes";
import reportRoutes from "../modules/reports/reports-routes";
import commentRoutes from "../modules/comments/comments-routes";
import categoryRoutes from "../modules/categories/categories-routes";
import dashboardRoutes from "../modules/dashboard/dashboard-routes";
import userRoutes from "../modules/users/users-routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/reports", reportRoutes);

router.use(
  "/comments",
  commentRoutes
);

router.use(
  "/categories",
  categoryRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);

router.use(
  "/users",
  userRoutes
);

export default router;