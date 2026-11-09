# Kima CMS — Tasks (Root)

Status: `[x]` done, `[ ]` next.

## Architecture

- [x] Define feature-based modular-monolith layout.
- [x] Separate data / logic / presentation per feature.
- [x] Keep shared code in `lib/`.
- [x] Document architecture in `docs/technical-solution.md`.
- [x] Add the documentation convention to `AGENTS.md`.

## Tooling

- [x] Versioned SQL migrations with a small runner (`scripts/migrate.mjs`).
- [x] Operator script to seed the first admin (`scripts/seed-admin.mjs`).
- [x] Unit tests for password, token, and login-input validation.
- [x] Playwright end-to-end tests for redirect, forged cookie, invalid login,
  valid login, and sign-out.
- [x] Manual test checklist in
  `docs/features/simple-auth/manual-test.md`.
- [x] `npm test` includes feature tests; `npm run test:e2e` runs the browser
  suite.

## Next

- [ ] Add repository/service tests against a disposable database.
- [ ] Add session cleanup for expired rows.
- [ ] Add rate limiting on the login action.
- [ ] Add role-based authorization when a second role exists.
- [ ] Split `lib/` into a workspace package only when a second app needs it.
