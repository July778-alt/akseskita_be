import { db } from "../../database";
import { PoolClient } from "pg";

import { CreateReportDTO } from "./reports-types";
import { getPagination } from "../../shared/utils/pagination";

export async function createReport(
  userId: string,
  data: CreateReportDTO
) {
  const query = `
    INSERT INTO reports (
      user_id,
      category_id,
      title,
      description,
      image_url,
      latitude,
      longitude,
      address
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8
    )
    RETURNING *
  `;

  const values = [
    userId,
    data.category_id,
    data.title,
    data.description,
    data.image_url || null,
    data.latitude || null,
    data.longitude || null,
    data.address || null,
  ];

  const result = await db.query(
    query,
    values
  );

  return result.rows[0];
}

export async function getReports(
  queryParams: any
) {
  const {
    page = 1,
    limit = 10,

    status,
    category_id,
    user_id,
    search,
    sort = "latest",
  } = queryParams;

  const pagination = getPagination(
    page,
    limit
  );

  let query = `
    SELECT
      reports.id,
      reports.title,
      reports.description,
      reports.image_url,
      reports.status,
      reports.created_at,

      users.full_name,

      categories.name AS category_name

    FROM reports

    LEFT JOIN users
      ON reports.user_id = users.id

    LEFT JOIN categories
      ON reports.category_id = categories.id

    WHERE 1=1
  `;

  const values: any[] = [];

  let index = 1;

  if (status && status !== "undefined" && status !== "null") {
    query += `
      AND reports.status = $${index}
    `;
    values.push(status);
    index++;
  }

  if (category_id && category_id !== "undefined" && category_id !== "null") {
    query += `
      AND reports.category_id = $${index}
    `;
    values.push(category_id);
    index++;
  }

  if (user_id && user_id !== "undefined" && user_id !== "null") {
    query += `
      AND reports.user_id = $${index}
    `;
    values.push(user_id);
    index++;
  }

  if (search) {
    query += `
      AND (
        reports.title ILIKE $${index}

        OR

        reports.description ILIKE $${index}
      )
    `;

    values.push(`%${search}%`);

    index++;
  }

  if (sort === "oldest") {
    query += `
      ORDER BY reports.created_at ASC
    `;
  } else {
    query += `
      ORDER BY reports.created_at DESC
    `;
  }

  query += `
    LIMIT $${index}
    OFFSET $${index + 1}
  `;

  values.push(
    pagination.limit,
    pagination.offset
  );
  
  const result = await db.query(
    query,
    values
  );

  return result.rows;
}

export async function getReportById(
  reportId: string
) {
  const query = `
    SELECT
      reports.*,

      users.full_name,

      categories.name AS category_name

    FROM reports

    LEFT JOIN users
      ON reports.user_id = users.id

    LEFT JOIN categories
      ON reports.category_id = categories.id

    WHERE reports.id = $1
  `;

  const result = await db.query(query, [
    reportId,
  ]);

  return result.rows[0];
}

export async function getReportOwner(
  reportId: string
) {
  const query = `
    SELECT user_id
    FROM reports
    WHERE id = $1
  `;

  const result = await db.query(query, [
    reportId,
  ]);

  return result.rows[0];
}


export async function deleteReport(
  reportId: string
) {
  const query = `
    DELETE FROM reports
    WHERE id = $1
  `;

  await db.query(query, [reportId]);
}

export async function countReports(
  queryParams: any
) {
  const {
    status,
    category_id,
    user_id,
    search,
  } = queryParams;

  let query = `
    SELECT COUNT(*) AS total
    FROM reports
    WHERE 1=1
  `;

  const values: any[] = [];

  let index = 1;

  if (status && status !== "undefined" && status !== "null") {
    query += `
      AND status = $${index}
    `;
    values.push(status);
    index++;
  }

  if (category_id && category_id !== "undefined" && category_id !== "null") {
    query += `
      AND category_id = $${index}
    `;
    values.push(category_id);
    index++;
  }

  if (user_id && user_id !== "undefined" && user_id !== "null") {
    query += `
      AND user_id = $${index}
    `;
    values.push(user_id);
    index++;
  }

  if (search) {
    query += `
      AND (
        title ILIKE $${index}

        OR

        description ILIKE $${index}
      )
    `;

    values.push(`%${search}%`);
    index++;
  }

  const result = await db.query(
    query,
    values
  );

  return Number(
    result.rows[0].total
  );
}

export async function updateReportStatus(
  reportId: string,
  status: string,
  client?: PoolClient
) {
  const query = `
    UPDATE reports
    SET
      status = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const executor = client || db;
  const result = await executor.query(query, [
    status,
    reportId,
  ]);

  return result.rows[0];
}