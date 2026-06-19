import { Pool, PoolClient } from "pg";
import { config } from "../config/env";
import { logger } from "../config/logger";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

pool.on("error", (err) => {
  logger.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

export const db = {
  async query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (config.NODE_ENV === "development") {
      // Log query details cleanly in development
      logger.debug(`SQL Query: ${text.trim().replace(/\s+/g, " ")} | Duration: ${duration}ms | Rows: ${res.rowCount}`);
    }
    
    return res;
  },

  async getClient(): Promise<PoolClient> {
    return await pool.connect();
  },

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },
};

export default pool;
