import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTES = 32;
const TOKEN_ENCODING = "base64url";
const TOKEN_DIGEST = "sha256";
const DIGEST_ENCODING = "hex";

export function createSessionToken(): string {
  return randomBytes(TOKEN_BYTES).toString(TOKEN_ENCODING);
}

export function hashSessionToken(token: string): string {
  return createHash(TOKEN_DIGEST).update(token).digest(DIGEST_ENCODING);
}
