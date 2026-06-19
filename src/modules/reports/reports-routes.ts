import { Router } from "express";
import {
  createReportController,
  getReportByIdController,
  getReportsController,
  deleteReportController,
  updateStatusController,
} from "./reports-controller";
import { getReportHistoriesController } from "../report-histories/report-histories-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { validate } from "../../middlewares/validate-middleware";
import { createReportSchema, updateStatusSchema } from "./reports-validation";
import { upload } from "../../config/multer";
import { roleMiddleware } from "../../middlewares/role-middleware";
import { requireStaff } from "../../middlewares/auth-middleware";

const router = Router();

// Get all reports (public — user only sees own, admin sees all)
router.get("/", getReportsController);

// Get report by ID (public)
router.get("/:id", getReportByIdController);

// Create a new report (authenticated users)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createReportSchema),
  createReportController
);

// Delete a report (authenticated — owner or admin only, checked in service)
router.delete(
  "/:id",
  authMiddleware,
  deleteReportController
);

// Update report status (admin/super_admin only)
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin", "super_admin"]),
  validate(updateStatusSchema),
  updateStatusController
);

// Get report status histories (public)
router.get("/:id/histories", getReportHistoriesController);

export default router;