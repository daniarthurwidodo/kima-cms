import assert from "node:assert/strict";
import { test } from "node:test";
import { hashPassword, verifyPassword } from "./password.ts";

test("verifyPassword accepts the original password", async () => {
  const hash = await hashPassword("correct horse battery staple");

  assert.strictEqual(await verifyPassword("correct horse battery staple", hash), true);
});

test("verifyPassword rejects a different password", async () => {
  const hash = await hashPassword("correct horse battery staple");

  assert.strictEqual(await verifyPassword("wrong password", hash), false);
});

test("hashPassword uses a unique salt per hash", async () => {
  const first = await hashPassword("same password");
  const second = await hashPassword("same password");

  assert.notStrictEqual(first, second);
});

test("verifyPassword rejects malformed hashes", async () => {
  assert.strictEqual(await verifyPassword("password", ""), false);
  assert.strictEqual(await verifyPassword("password", "bcrypt$abc$def"), false);
  assert.strictEqual(await verifyPassword("password", "scrypt$abc$def"), false);
});
