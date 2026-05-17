import pool from "../../config/db";

export async function categoriesSeed() {
  const query = `
    INSERT INTO categories (
      name
    )

    VALUES

    (
      'Jalan Rusak'
    ),

    (
      'Trotoar Rusak'
    ),

    (
      'Zebra Cross'
    ),

    (
      'Fasilitas Disabilitas'
    ),

    (
      'Lampu Lalu Lintas'
    )

    ON CONFLICT (name)
    DO NOTHING
  `;

  await pool.query(query);

  console.log(
    "Categories seed completed"
  );
}