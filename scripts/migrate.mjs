import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadEnv } from "./load-env.mjs";
import { getPool } from "../lib/db.ts";
import { logger } from "../lib/logger.ts";

loadEnv();

const MIGRATIONS_DIR = join(import.meta.dirname, "..", "db", "migrations");
const UP_SUFFIX = ".up.sql";
const CREATE_MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
const FIND_MIGRATION = "SELECT 1 FROM schema_migrations WHERE version = $1";
const RECORD_MIGRATION = "INSERT INTO schema_migrations (version) VALUES ($1)";

const pool = getPool();

try {
  await pool.query(CREATE_MIGRATIONS_TABLE);

  const files = (await readdir(MIGRATIONS_DIR))
    .filter((file) => file.endsWith(UP_SUFFIX))
    .sort();

  for (const file of files) {
    const version = file.slice(0, -UP_SUFFIX.length);
    const applied = await pool.query(FIND_MIGRATION, [version]);

    if (applied.rowCount > 0) {
      logger.info({ version }, "Migration already applied");
      continue;
    }

    const sql = await readFile(join(MIGRATIONS_DIR, file), "utf8");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(RECORD_MIGRATION, [version]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    logger.info({ version }, "Migration applied");
  }
} finally {
  await pool.end();
}
