import { createComment, getCommentsByReportId, deleteComment, getCommentById } from "./comments-repository";
import { notifyUser } from "../notifications/notifications-service";
import { getReportOwner } from "../reports/reports-repository";
import { getAdmins, getUserById } from "../users/users-repository";
import { storage } from "../../shared/utils/storage";

export async function addCommentToReport(
  reportId: string,
  userId: string,
  content: string
) {
  const comment = await createComment(reportId, userId, content);
  
  const reportOwner = await getReportOwner(reportId);
  const commenter = await getUserById(userId);

  // 1. Notify the report owner if someone else commented
  if (reportOwner && reportOwner.user_id !== userId) {
    await notifyUser({
      user_id: reportOwner.user_id,
      title: "New Comment",
      message: `${commenter.full_name} has added a comment to your report.`,
      type: "admin_message",
      reference_id: reportId,
    }).catch(err => console.error("Failed to send notification:", err));
  }
  
  // 2. Notify all admins if a regular user commented
  if (commenter.role === "user") {
    const admins = await getAdmins();
    for (const admin of admins) {
      await notifyUser({
        user_id: admin.id,
        title: "New User Comment",
        message: `${commenter.full_name} added a comment to a report.`,
        type: "system",
        reference_id: reportId,
      }).catch(err => console.error("Failed to notify admin:", err));
    }
  }
  // Fetch fully populated comment with user details
  const populatedComment = await getCommentById(comment.id);
  if (populatedComment) {
    populatedComment.author_avatar = storage.getFileUrl(populatedComment.author_avatar);
  }
  
  return populatedComment;
}

export async function getReportComments(reportId: string) {
  const comments = await getCommentsByReportId(reportId);
  return comments.map((comment: any) => ({
    ...comment,
    author_avatar: storage.getFileUrl(comment.author_avatar),
  }));
}

export async function removeComment(id: string, userId: string) {
  return deleteComment(id, userId);
}