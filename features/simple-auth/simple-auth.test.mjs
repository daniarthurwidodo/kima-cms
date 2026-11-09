import assert from "node:assert/strict";
import { test } from "node:test";
import { parseLoginInput } from "./simple-auth.validation.ts";

function createFormData(email, password) {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  return formData;
}

test("parseLoginInput accepts and normalizes a valid email", () => {
  const result = parseLoginInput(
    createFormData("  Admin@Example.COM ", "secret-password"),
  );

  assert.deepStrictEqual(result, {
    ok: true,
    value: { email: "admin@example.com", password: "secret-password" },
  });
});

test("parseLoginInput rejects an invalid email", () => {
  const result = parseLoginInput(createFormData("not-an-email", "secret"));

  assert.strictEqual(result.ok, false);
});

test("parseLoginInput rejects an empty password", () => {
  const result = parseLoginInput(createFormData("admin@example.com", ""));

  assert.strictEqual(result.ok, false);
});

test("parseLoginInput rejects an oversized password", () => {
  const result = parseLoginInput(
    createFormData("admin@example.com", "x".repeat(129)),
  );

  assert.strictEqual(result.ok, false);
});
