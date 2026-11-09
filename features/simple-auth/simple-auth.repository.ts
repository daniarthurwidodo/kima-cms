import type { Pool } from "pg";
import type { AuthUser, PasswordUser } from "./simple-auth.types";

const USER_WITH_PASSWORD_QUERY = `
  SELECT id, email, name, password_hash, is_active
  FROM users
  WHERE email = $1
  LIMIT 1
`;

const USER_BY_SESSION_QUERY = `
  SELECT u.id, u.email, u.name
  FROM sessions s
  JOIN users u ON u.id = s.user_id
  WHERE s.token_hash = $1
    AND s.expires_at > now()
    AND u.is_active = TRUE
  LIMIT 1
`;

const INSERT_SESSION_QUERY = `
  INSERT INTO sessions (user_id, token_hash, expires_at)
  VALUES ($1, $2, $3)
`;

const DELETE_SESSION_QUERY = "DELETE FROM sessions WHERE token_hash = $1";

type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  is_active: boolean;
};

type AuthUserRow = {
  id: string;
  email: string;
  name: string;
};

export async function findUserByEmail(
  pool: Pool,
  email: string,
): Promise<PasswordUser | null> {
  const result = await pool.query<UserRow>(USER_WITH_PASSWORD_QUERY, [email]);
  const row = result.rows[0];

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    isActive: row.is_active,
  };
}

export async function findUserBySessionTokenHash(
  pool: Pool,
  tokenHash: string,
): Promise<AuthUser | null> {
  const result = await pool.query<AuthUserRow>(USER_BY_SESSION_QUERY, [
    tokenHash,
  ]);
  const row = result.rows[0];

  if (!row) return null;

  return { id: row.id, email: row.email, name: row.name };
}

export async function insertSession(
  pool: Pool,
  userId: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await pool.query(INSERT_SESSION_QUERY, [userId, tokenHash, expiresAt]);
}

export async function deleteSession(
  pool: Pool,
  tokenHash: string,
): Promise<void> {
  await pool.query(DELETE_SESSION_QUERY, [tokenHash]);
}
