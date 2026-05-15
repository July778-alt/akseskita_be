import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool from "../config/db";

// pengganti __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    const migrationsPath = path.join(__dirname, "migrations");

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const filePath = path.join(migrationsPath, file);

      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Running migration: ${file}`);

      await pool.query(sql);
    }

    console.log("All migrations executed.");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);

    process.exit(1);
  }
}

migrate();