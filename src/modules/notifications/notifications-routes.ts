import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth-middleware";
import * as controller from "./notifications-controller";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getMyNotifications);
router.patch("/mark-all-read", controller.markAllRead);
router.patch("/:id/read", controller.markRead);

export default router;
