import pool from "../../config/db";

export async function createComment(
  reportId: string,
  userId: string,
  message: string
) {
  const query = `
    INSERT INTO comments (
      report_id,
      user_id,
      message
    )
    VALUES ($1, $2, $3)

    RETURNING *
  `;

  const values = [
    reportId,
    userId,
    message,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
}

export async function getCommentsByReport(
  reportId: string
) {
  const query = `
    SELECT
      comments.id,
      comments.message,
      comments.created_at,

      users.full_name,
      users.role

    FROM comments

    JOIN users
      ON comments.user_id = users.id

    WHERE comments.report_id = $1

    ORDER BY comments.created_at ASC
  `;

  const result = await pool.query(query, [
    reportId,
  ]);

  return result.rows;
}

export async function deleteComment(
  commentId: string
) {
  const query = `
    DELETE FROM comments
    WHERE id = $1
  `;

  await pool.query(query, [commentId]);
}

export async function getCommentOwner(
  commentId: string
) {
  const query = `
    SELECT user_id
    FROM comments
    WHERE id = $1
  `;

  const result = await pool.query(query, [
    commentId,
  ]);

  return result.rows[0];
}