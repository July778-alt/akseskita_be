import { createComment, getCommentsByReportId, deleteComment } from "./comments-repository";

export async function addCommentToReport(
  reportId: string,
  userId: string,
  content: string
) {
  return createComment(reportId, userId, content);
}

export async function getReportComments(reportId: string) {
  return getCommentsByReportId(reportId);
}

export async function removeComment(id: string, userId: string) {
  return deleteComment(id, userId);
}