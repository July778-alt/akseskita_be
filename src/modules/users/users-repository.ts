import pool from "../../config/db";

export async function getUsers() {
  const query = `
    SELECT
      id,
      full_name,
      email,
      role,
      profile_picture,
      created_at
    FROM users
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getUserById(userId: string) {
  const query = `
    SELECT
      id,
      full_name,
      email,
      role,
      profile_picture,
      created_at
    FROM users
    WHERE id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

export async function updateUser(userId: string, data: any) {
  const query = `
    UPDATE users
    SET
      full_name = COALESCE($1, full_name),
      profile_picture = COALESCE($2, profile_picture),
      updated_at = NOW()
    WHERE id = $3
    RETURNING id, full_name, email, role, profile_picture
  `;
  const values = [data.full_name, data.profile_picture, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteUser(userId: string) {
  const query = `
    DELETE FROM users
    WHERE id = $1
  `;
  await pool.query(query, [userId]);
}

export async function updateUserRole(userId: string, role: string) {
  const query = `
    UPDATE users
    SET 
      role = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING id, full_name, email, role, profile_picture
  `;
  const result = await pool.query(query, [role, userId]);
  return result.rows[0];
}

export async function countUsers() {
  const query = `
    SELECT COUNT(*)
    FROM users
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count);
}
