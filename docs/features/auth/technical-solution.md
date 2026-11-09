# Auth — Technical Solution

## Data model

Migration: `db/migrations/0001_simple_auth.up.sql` (down file beside it).

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `BIGSERIAL` | Surrogate PK. |
| `email` | `TEXT` | Normalized to lowercase by the service; unique index. |
| `name` | `TEXT` | Display name. |
| `password_hash` | `TEXT` | `scrypt$<salt-hex>$<key-hex>`. |
| `is_active` | `BOOLEAN` | Inactive users cannot sign in. |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | Audit columns. |

### `sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `BIGSERIAL` | Surrogate PK. |
| `user_id` | `BIGINT` | Logical FK to `users.id`, indexed, no constraint. |
| `token_hash` | `TEXT` | SHA-256 of the opaque token; unique index. |
| `expires_at` | `TIMESTAMPTZ` | Checked on every lookup; indexed. |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | Audit columns. |

## Flow

### Sign in

1. `LoginForm` posts to `loginAction` through `useActionState`.
2. `parseLoginInput` trims/lowercases the email and rejects malformed input.
3. `authenticate` loads the user, verifies the scrypt hash with
   `timingSafeEqual`, and creates a 32-byte token.
4. Only the SHA-256 hash of the token is inserted into `sessions`.
5. The raw token is set in the `kima_session` cookie (`httpOnly`,
   `sameSite=lax`, `secure` in production) and the action redirects to `/admin`.

### Authorize a request

1. `proxy.ts` matches `/admin/:path*` and redirects when the cookie is absent.
2. `app/admin/layout.tsx` calls `getCurrentUser`, which hashes the cookie token
   and joins `sessions` to `users` with an expiry and `is_active` check.
3. `export const instant = false` keeps this request-time check blocking under
   Cache Components.

### Sign out

`logoutAction` deletes the session row by token hash, clears the cookie, and
redirects to `/login`.

## Files

| File | Responsibility |
| --- | --- |
| `auth.constants.ts` | Cookie name, paths, TTL, limits, messages. |
| `auth.types.ts` | `AuthUser`, `Session`, `LoginInput`. |
| `auth.validation.ts` | `parseLoginInput` (pure). |
| `auth.repository.ts` | Parameterized SQL and row mapping. |
| `auth.service.ts` | Authenticate, resolve, end session. |
| `auth.session.ts` | Next.js cookie/current-user helpers. |
| `auth.actions.ts` | `loginAction`, `logoutAction`. |
| `components/login-form.tsx` | Client form and error display. |
| `app/login/page.tsx` | Login page. |
| `app/admin/layout.tsx` | Authoritative guard. |
| `proxy.ts` | Optimistic cookie guard. |

Shared primitives: `lib/password.ts`, `lib/token.ts`, `lib/db.ts`.

## Security notes

- Passwords: scrypt, 16-byte random salt, 64-byte key, constant-time compare.
- Tokens: 32 random bytes, base64url; database stores only SHA-256.
- Errors: generic message for unknown user and wrong password.
- CSRF: Server Actions plus `sameSite=lax`.
- Known limit: unknown emails skip the scrypt work, so timing can reveal
  account existence. Noted as a `shortcut:` in the service.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Unit | `npm test` | 12 passing |
| E2E | `npm run test:e2e` | 4 passing (system Chrome) |
| Types | `npx tsc --noEmit` | clean |
| Lint | `npm run lint` | clean |
| Build | `npm run build` | `/admin` dynamic, proxy compiled |

E2E prerequisites: `npm run db:up`; global setup applies migrations and seeds
`e2e-admin@kima.local`. Manual checks live in `manual-test.md`.

## Configuration

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `ADMIN_NAME` | Seeded admin display name (optional). |
| `ADMIN_EMAIL` | Seeded admin email. |
| `ADMIN_PASSWORD` | Seeded admin password, minimum 8 characters. |

## Operations

```bash
npm run db:up
npm run db:migrate
npm run db:seed-admin
npm run dev
```

Migrations are applied once and recorded in `schema_migrations`. The seed
script is safe to re-run; it only inserts when the email is absent.
