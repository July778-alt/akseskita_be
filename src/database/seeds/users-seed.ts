import { db } from "../index";
import bcrypt from "bcrypt";
import { config } from "../../config/env";

export async function usersSeed() {
  const password =
    await bcrypt.hash(
      "admin123",
      10
    );

  const query = `
    INSERT INTO users (
      full_name,
      email,
      password,
      role
    )

    VALUES
    (
      'Super Admin',
      'admin@akseskita.com',
      $1,
      'super_admin'
    ),

    (
      'Radit',
      'radit@gmail.com',
      $1,
      'user'
    )

    ON CONFLICT (email)
    DO NOTHING
  `;

  await db.query(query, [password]);

  console.log(
    "Users seed completed"
  );
}