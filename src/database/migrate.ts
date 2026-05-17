import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  try {
    // 1. Create migrations table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const migrationsPath = path.join(__dirname, "migrations");
    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // 2. Get already executed migrations
    const { rows: executedRows } = await db.query("SELECT name FROM migrations");
    const executedMigrations = new Set(executedRows.map(row => row.name));

    for (const file of files) {
      if (executedMigrations.has(file)) {
        continue;
      }

      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`🚀 Running migration: ${file}`);
      
      // Run in transaction
      await db.transaction(async (client) => {
        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      });
    }

    console.log("✅ All migrations up to date.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();