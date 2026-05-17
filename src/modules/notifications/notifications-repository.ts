import { db } from "../../database";

export async function createNotification(data: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
}) {
  const query = `
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [data.user_id, data.title, data.message, data.type, data.reference_id || null];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getNotifications(userId: string, limit = 20, offset = 0) {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const result = await db.query(query, [userId, limit, offset]);
  return result.rows;
}

export async function getUnreadCount(userId: string) {
  const query = `
    SELECT COUNT(*) as count FROM notifications
    WHERE user_id = $1 AND is_read = FALSE
  `;
  const result = await db.query(query, [userId]);
  return parseInt(result.rows[0].count);
}

export async function markAsRead(id: string, userId: string) {
  const query = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await db.query(query, [id, userId]);
  return result.rows[0];
}

export async function markAllAsRead(userId: string) {
  const query = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = $1 AND is_read = FALSE
  `;
  await db.query(query, [userId]);
  return true;
}
