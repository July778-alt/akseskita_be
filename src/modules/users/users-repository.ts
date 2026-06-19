import pool from "../../config/db";
import { getPagination } from "../../shared/utils/pagination";

export async function getUsers(queryParams: any = {}) {
  const {
    page = 1,
    limit = 10,
    search,
  } = queryParams;

  const pagination = getPagination(
    Number(page),
    Number(limit)
  );

  let query = `
    SELECT
      id,
      full_name,
      email,
      role,
      profile_picture,
      created_at
    FROM users
    WHERE 1=1
  `;

  const values: any[] = [];
  let index = 1;

  if (search) {
    query += `
      AND (
        full_name ILIKE $${index}
        OR
        email ILIKE $${index}
      )
    `;
    values.push(`%${search}%`);
    index++;
  }

  query += `
    ORDER BY created_at DESC
    LIMIT $${index}
    OFFSET $${index + 1}
  `;

  values.push(
    pagination.limit,
    pagination.offset
  );

  const result = await pool.query(query, values);
  return result.rows;
}

export async function getAdmins() {
  const query = `
    SELECT id
    FROM users
    WHERE role IN ('admin', 'super_admin')
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

export async function countUsers(queryParams: any = {}) {
  const { search } = queryParams;

  let query = `
    SELECT COUNT(*)
    FROM users
    WHERE 1=1
  `;

  const values: any[] = [];
  let index = 1;

  if (search) {
    query += `
      AND (
        full_name ILIKE $${index}
        OR
        email ILIKE $${index}
      )
    `;
    values.push(`%${search}%`);
    index++;
  }

  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count);
}
