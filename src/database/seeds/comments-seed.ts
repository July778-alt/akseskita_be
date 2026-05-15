import pool from "../../config/db";

export async function commentsSeed() {
  const userResult =
    await pool.query(`
      SELECT id
      FROM users
      LIMIT 1
    `);

  const reportResult =
    await pool.query(`
      SELECT id
      FROM reports
      LIMIT 1
    `);

  const userId =
    userResult.rows[0].id;

  const reportId =
    reportResult.rows[0].id;

  const query = `
    INSERT INTO comments (
      report_id,
      user_id,
      message
    )

    VALUES

    (
      $1,
      $2,
      'Laporan sedang diproses'
    )
  `;

  await pool.query(query, [
    reportId,
    userId,
  ]);

  console.log(
    "Comments seed completed"
  );
}