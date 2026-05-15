import pool from "../../config/db";

export async function categoriesSeed() {
  const query = `
    INSERT INTO categories (
      name,
      icon
    )

    VALUES

    (
      'Jalan Rusak',
      'road'
    ),

    (
      'Trotoar Rusak',
      'footprints'
    ),

    (
      'Zebra Cross',
      'square'
    ),

    (
      'Fasilitas Disabilitas',
      'accessibility'
    ),

    (
      'Lampu Lalu Lintas',
      'traffic-light'
    )

    ON CONFLICT (name)
    DO NOTHING
  `;

  await pool.query(query);

  console.log(
    "Categories seed completed"
  );
}