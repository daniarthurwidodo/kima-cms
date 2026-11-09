import { loadEnv } from "./load-env.mjs";
import { getPool } from "../lib/db.ts";
import { logger } from "../lib/logger.ts";
import { hashPassword } from "../lib/password.ts";
import { PASSWORD_MIN_LENGTH } from "../features/simple-auth/simple-auth.constants.ts";

loadEnv();

const DEFAULT_ADMIN_NAME = "Administrator";
const FIND_USER = "SELECT 1 FROM users WHERE email = $1";
const INSERT_USER =
  "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || DEFAULT_ADMIN_NAME;

if (!email || !password) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
}

if (password.length < PASSWORD_MIN_LENGTH) {
  throw new Error(
    `ADMIN_PASSWORD must be at least ${PASSWORD_MIN_LENGTH} characters`,
  );
}

const pool = getPool();

try {
  const existing = await pool.query(FIND_USER, [email]);

  if (existing.rowCount > 0) {
    logger.info({ email }, "Admin user already exists");
  } else {
    const passwordHash = await hashPassword(password);
    await pool.query(INSERT_USER, [email, name, passwordHash]);
    logger.info({ email }, "Admin user created");
  }
} finally {
  await pool.end();
}
