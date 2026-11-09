# Simple Auth — Tasks

Status: `[x]` done, `[ ]` next.

## Schema

- [x] `users` and `sessions` migration with indexes and down file.
- [x] Migration runner records applied versions.

## Shared primitives

- [x] `lib/password.ts` scrypt hash + constant-time verify.
- [x] `lib/token.ts` random token + SHA-256 hash.
- [x] Unit tests for both.

## Feature

- [x] Input validation with normalization.
- [x] Repository with parameterized SQL.
- [x] Service: authenticate, resolve session, end session.
- [x] Cookie/session helpers.
- [x] Login and logout Server Actions.
- [x] Login page and client form.
- [x] Protected `/admin` layout with authoritative DB check.
- [x] Optimistic `proxy.ts` guard.
- [x] Sign-out control in the admin header.
- [x] Seed-admin script.
- [x] Unit tests for input validation.
- [x] Playwright end-to-end suite (`e2e/auth.spec.ts`).
- [x] Manual test checklist (`docs/features/simple-auth/manual-test.md`).

## Next

- [ ] Integration tests with a disposable PostgreSQL database.
- [ ] Rate limiting / lockout on failed sign-ins.
- [ ] Expired-session cleanup job.
- [ ] Password change and reset flows.
