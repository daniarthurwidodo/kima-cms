import assert from "node:assert/strict";
import { test } from "node:test";
import { createSessionToken, hashSessionToken } from "./token.ts";

test("createSessionToken returns unique tokens", () => {
  assert.notStrictEqual(createSessionToken(), createSessionToken());
});

test("hashSessionToken is deterministic and hides the token", () => {
  const token = createSessionToken();
  const hash = hashSessionToken(token);

  assert.strictEqual(hash, hashSessionToken(token));
  assert.notStrictEqual(hash, token);
});
