import { Router } from "express";
import {
  createReportController,
  getReportByIdController,
  getReportsController,
  deleteReportController,
  updateReportController,
  getReportHistoriesController,
} from "./reports-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { validate } from "../../middlewares/validate-middleware";
import { createReportSchema,updateReportSchema,updateStatusSchema } from "./reports-validation";
import { upload } from "../../config/multer";
import { roleMiddleware } from "../../middlewares/role-middleware";
import { updateStatusController } from "./reports-controller";

const router = Router();

router.get(
  "/",
  getReportsController
);

router.get(
  "/:id",
  getReportByIdController
);


router.post(
  "/",

  authMiddleware,

  upload.single("image"),

  validate(createReportSchema),

  createReportController
);

router.put(
  "/:id",

  authMiddleware,

  upload.single("image"),

  validate(updateReportSchema),

  updateReportController
);

router.delete(
  "/:id",

  authMiddleware,

  deleteReportController
);

router.patch(
  "/:id/status",

  authMiddleware,

  roleMiddleware([
    "admin",
    "super_admin",
  ]),

  validate(updateStatusSchema),

  updateStatusController
);

router.get(
  "/:id/histories",
  getReportHistoriesController
);

export default router;