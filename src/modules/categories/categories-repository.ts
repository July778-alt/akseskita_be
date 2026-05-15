import pool from "../../config/db";

import { CreateCategoryDTO } from "./categories-types";

export async function createCategory(
  data: CreateCategoryDTO
) {
  const query = `
    INSERT INTO categories (
      name,
      icon
    )

    VALUES ($1, $2)

    RETURNING *
  `;

  const values = [
    data.name,
    data.icon || null,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
}

export async function getCategories() {
  const query = `
    SELECT *
    FROM categories

    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows;
}

export async function getCategoryById(
  categoryId: string
) {
  const query = `
    SELECT *
    FROM categories
    WHERE id = $1
  `;

  const result = await pool.query(query, [
    categoryId,
  ]);

  return result.rows[0];
}

export async function updateCategory(
  categoryId: string,
  data: any
) {
  const query = `
    UPDATE categories

    SET
      name = COALESCE($1, name),

      icon = COALESCE($2, icon)

    WHERE id = $3

    RETURNING *
  `;

  const values = [
    data.name,
    data.icon,
    categoryId,
  ];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
}

export async function deleteCategory(
  categoryId: string
) {
  const query = `
    DELETE FROM categories
    WHERE id = $1
  `;

  await pool.query(query, [categoryId]);
}