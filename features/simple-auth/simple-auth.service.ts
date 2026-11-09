import type { Pool } from "pg";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, hashSessionToken } from "@/lib/token";
import { SESSION_DURATION_MS } from "./simple-auth.constants";
import {
  deleteSession,
  findUserByEmail,
  findUserBySessionTokenHash,
  insertSession,
} from "./simple-auth.repository";
import type { AuthUser, LoginInput, Session } from "./simple-auth.types";

// shortcut: unknown emails skip scrypt, so response time can reveal whether an
// account exists; add a dummy hash verification if user enumeration matters.
export async function authenticate(
  pool: Pool,
  input: LoginInput,
): Promise<Session | null> {
  const user = await findUserByEmail(pool, input.email);

  if (!user || !user.isActive) return null;

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
  if (!isPasswordValid) return null;

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await insertSession(pool, user.id, hashSessionToken(token), expiresAt);

  return {
    token,
    expiresAt,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function resolveSession(
  pool: Pool,
  token: string,
): Promise<AuthUser | null> {
  return findUserBySessionTokenHash(pool, hashSessionToken(token));
}

export async function endSession(pool: Pool, token: string): Promise<void> {
  await deleteSession(pool, hashSessionToken(token));
}
