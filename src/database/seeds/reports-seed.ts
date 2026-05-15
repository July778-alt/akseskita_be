import pool from "../../config/db";

export async function reportsSeed() {
  const userResult =
    await pool.query(`
      SELECT id
      FROM users
      LIMIT 1
    `);

  const categoryResult =
    await pool.query(`
      SELECT id
      FROM categories
      LIMIT 1
    `);

  const userId =
    userResult.rows[0].id;

  const categoryId =
    categoryResult.rows[0].id;

  const query = `
    INSERT INTO reports (
      user_id,
      category_id,
      title,
      description,
      status,
      address
    )

    VALUES

    (
      $1,
      $2,
      'Jalan berlubang besar',
      'Jalan di dekat lampu merah rusak parah',
      'pending',
      'Bekasi'
    ),

    (
      $1,
      $2,
      'Zebra cross memudar',
      'Sudah hampir tidak terlihat',
      'verified',
      'Jakarta'
    )
  `;

  await pool.query(query, [
    userId,
    categoryId,
  ]);

  console.log(
    "Reports seed completed"
  );
}