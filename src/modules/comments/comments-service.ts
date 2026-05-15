import {
  createComment,
  deleteComment,
  getCommentOwner,
  getCommentsByReport,
} from "./comments-repository";

export async function createCommentService(
  reportId: string,
  userId: string,
  message: string
) {
  return createComment(
    reportId,
    userId,
    message
  );
}

export async function getCommentsService(
  reportId: string
) {
  return getCommentsByReport(reportId);
}

export async function deleteCommentService(
  commentId: string,
  userId: string,
  userRole: string
) {
  const owner =
    await getCommentOwner(commentId);

  if (!owner) {
    throw new Error(
      "Comment not found"
    );
  }

  const isOwner =
    owner.user_id === userId;

  const isAdmin = [
    "admin",
    "super_admin",
  ].includes(userRole);

  if (!isOwner && !isAdmin) {
    throw new Error(
      "You cannot delete this comment"
    );
  }

  await deleteComment(commentId);
}