# Auth — Memory

## Decisions

- 2026-11-09 — In-house auth over a library: scrypt + opaque DB sessions. No
  new dependency.
- 2026-11-09 — No public signup. The first admin is seeded from
  `ADMIN_EMAIL` / `ADMIN_PASSWORD`; the seed is idempotent.
- 2026-11-09 — Sessions are DB rows keyed by the SHA-256 of the cookie token.
  Expiry and `is_active` are re-checked on every request.
- 2026-11-09 — Proxy is optimistic only. The admin layout owns the real check,
  matching the Next.js authentication guidance.
- 2026-11-09 — `app/admin/layout.tsx` sets `instant = false` because the
  session check is request-time under Cache Components.
- 2026-11-09 — `/admin` is protected; `/` and `/login` stay public, so the
  existing dashboard moved from `app/page.tsx` to `app/admin/page.tsx`.
- 2026-11-09 — Feature code lives in `features/auth/`; docs in
  `docs/features/auth/`.

## Gotchas

- `pg` returns `BIGINT` as a string; `AuthUser.id` is typed as `string`.
- Node type stripping does not resolve the `@/` alias, so scripts import with
  relative paths.
- `scripts/load-env.mjs` expands `${VAR}` references because Node's
  `--env-file` does not.
- The cookie name is `kima_session`; changing it invalidates existing sessions.

## Testing

- Unit: `npm test` runs `node --test` over password, token, and validation
  tests; no database needed.
- E2E: `npm run test:e2e` runs Playwright with the installed system Chrome
  (`channel: "chrome"`). `e2e/global-setup.ts` applies migrations and seeds
  `e2e-admin@kima.local` before the suite.
- Manual: `docs/features/auth/manual-test.md` covers redirects, invalid
  and valid sign-in, sign-out, forged/expired sessions, inactive users, and
  seed idempotency.
- Gotcha: Next.js adds its own route announcer with `role="alert"`, so the
  invalid-login test matches the error text instead of the role.

## Known limits

- Unknown emails return faster than wrong passwords (enumeration timing).
- No rate limiting, password reset, or multi-role authorization yet.
- Expired session rows are ignored on read but not deleted automatically.
