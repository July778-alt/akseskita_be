// c:\laragon\www\CodeH\AksesKita\be\src\config\db.ts

import { Pool } from "pg";
import { config } from "./env"; // Change 'env' to 'config'

const pool = new Pool({
  // Use the validated connection string from your new config
  connectionString: config.DATABASE_URL,
});

export default pool;
