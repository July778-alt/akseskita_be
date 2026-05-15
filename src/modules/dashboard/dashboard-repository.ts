import pool from "../../config/db";

export async function getDashboardStats() {
  const query = `
    SELECT
      COUNT(*) AS total_reports,

      COUNT(*) FILTER (
        WHERE status = 'pending'
      ) AS pending_reports,

      COUNT(*) FILTER (
        WHERE status = 'verified'
      ) AS verified_reports,

      COUNT(*) FILTER (
        WHERE status = 'in_progress'
      ) AS in_progress_reports,

      COUNT(*) FILTER (
        WHERE status = 'resolved'
      ) AS resolved_reports,

      COUNT(*) FILTER (
        WHERE status = 'rejected'
      ) AS rejected_reports

    FROM reports
  `;

  const result = await pool.query(query);

  return result.rows[0];
}

export async function getTotalUsers() {
  const query = `
    SELECT COUNT(*) AS total_users
    FROM users
  `;

  const result = await pool.query(query);

  return result.rows[0];
}

export async function getTotalCategories() {
  const query = `
    SELECT COUNT(*) AS total_categories
    FROM categories
  `;

  const result = await pool.query(query);

  return result.rows[0];
}

export async function getMostReportedCategory() {
  const query = `
    SELECT
      categories.name,

      COUNT(reports.id) AS total

    FROM reports

    JOIN categories
      ON reports.category_id = categories.id

    GROUP BY categories.name

    ORDER BY total DESC

    LIMIT 1
  `;

  const result = await pool.query(query);

  return result.rows[0];
}

export async function getReportsPerMonth() {
  const query = `
    SELECT
      TO_CHAR(
        created_at,
        'Mon'
      ) AS month,

      COUNT(*) AS total

    FROM reports

    GROUP BY month

    ORDER BY MIN(created_at)
  `;

  const result = await pool.query(query);

  return result.rows;
}