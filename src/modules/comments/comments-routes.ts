import { Router } from "express";
import { addComment, getComments, deleteCommentController } from "./comments-controller";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { validate } from "../../middlewares/validate-middleware";
import { createCommentSchema } from "./comments-schemas";

const router = Router();

// Get comments for a report (Public/Auth)
router.get("/reports/:reportId/comments", getComments);

// Add comment to a report (Authenticated)
router.post(
  "/reports/:reportId/comments",
  authMiddleware,
  validate(createCommentSchema),
  addComment
);

// Delete a comment (Authenticated, Owner only check in controller)
router.delete("/comments/:id", authMiddleware, deleteCommentController);

export default router;