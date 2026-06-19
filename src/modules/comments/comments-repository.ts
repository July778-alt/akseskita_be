import { db } from "../../database";

export async function createComment(
  reportId: string,
  userId: string,
  content: string
) {
  const query = `
      INSERT INTO comments (report_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING *
  `;
  const result = await db.query(query, [reportId, userId, content]);
  return result.rows[0];
}

export async function getCommentsByReportId(reportId: string) {
  const query = `
    SELECT 
      comments.id,
      comments.message AS content,
      comments.created_at,
      comments.user_id,
      users.full_name AS author_name,
      users.role,
      users.profile_picture AS author_avatar
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.report_id = $1
    ORDER BY comments.created_at DESC
  `;
  const result = await db.query(query, [reportId]);
  return result.rows;
}

export async function getCommentById(id: string) {
  const query = `
    SELECT 
      comments.id,
      comments.message AS content,
      comments.created_at,
      comments.user_id,
      users.full_name AS author_name,
      users.role,
      users.profile_picture AS author_avatar
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

export async function deleteComment(id: string, userId: string) {
  const query = `
      DELETE FROM comments
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
  const result = await db.query(query, [id, userId]);
  return result.rows[0];
}
