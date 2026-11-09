# Kima CMS — Memory (Root)

Durable decisions and context for future sessions.

## Decisions

- 2026-11-09 — Architecture: modular monolith, feature-based, no monorepo.
  Shared code stays in `lib/` until a second consumer exists.
- 2026-11-09 — Database is a dumb store: no FKs, cascades, triggers, or
  business-rule constraints. Relationships are logical and indexed.
- 2026-11-09 — Migrations are plain SQL with a small Node runner rather than a
  new dependency.
- 2026-11-09 — Authentication: in-house credentials and DB-backed opaque
  sessions; no auth library. Seed admin only, no public signup.
- 2026-11-09 — `/admin` is protected; `/` and `/login` are public.
- 2026-11-09 — Documentation convention: every `docs/` level contains
  `prd.md`, `technical-solution.md`, `tasks.md`, and `memory.md`.

## Testing

- Unit tests: `npm test` (Node test runner, no database).
- E2E tests: `npm run test:e2e` (Playwright + system Chrome); global setup
  migrates and seeds a dedicated e2e admin.
- Manual checklist: `docs/features/simple-auth/manual-test.md`.
- Verified: unit 12/12, e2e 4/4, `tsc --noEmit`, `eslint`, and `next build`.

## Constraints

- Next.js 16.4 with `cacheComponents` and `partialPrefetching` enabled;
  middleware is called Proxy.
- Node 24 runs `.ts` files directly via type stripping; scripts use `.mjs` and
  relative imports because path aliases are not resolved outside Next.
- `.env` uses `${VAR}` references and Node's `--env-file` does not expand
  them, so scripts use `scripts/load-env.mjs`.
