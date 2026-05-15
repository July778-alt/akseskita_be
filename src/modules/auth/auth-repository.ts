import pool from "../../config/db";

import { RegisterDTO } from "./auth-types";

export async function findUserByEmail(email: string) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
}

export async function createUser(data: RegisterDTO) {
  const query = `
    INSERT INTO users (
      full_name,
      email,
      password
    )
    VALUES ($1, $2, $3)
    RETURNING id, full_name, email, role
  `;

  const values = [
    data.full_name,
    data.email,
    data.password,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function findUserById(id: string) {
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

  const result = await pool.query(query, [id]);

  return result.rows[0];
}