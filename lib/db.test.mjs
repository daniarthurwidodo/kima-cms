import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { getPool } from "./db.ts";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
    return;
  }

  process.env.DATABASE_URL = originalDatabaseUrl;
});

test("getPool requires DATABASE_URL", () => {
  delete process.env.DATABASE_URL;
  assert.throws(() => getPool(), /DATABASE_URL is not configured/);
});

test("getPool reuses its connection pool", async () => {
  process.env.DATABASE_URL = "postgresql://localhost/kima_test";
  const pool = getPool();

  try {
    assert.strictEqual(getPool(), pool);
  } finally {
    await pool.end();
  }
});
