# Kima CMS — Technical Solution (Root)

## Shape

A **modular monolith** on Next.js 16 App Router.

```
app/                     Presentation and routing only
  (routes, layouts, route handlers, server actions wiring)
features/<feature>/      One self-contained business feature
  *.constants.ts
  *.types.ts
  *.validation.ts        Input rules (business layer)
  *.repository.ts        SQL only (data layer)
  *.service.ts           Business rules (logic layer)
  *.session.ts           Feature's server-side request helpers
  *.actions.ts           Server Actions (entry points)
  components/            Feature UI
  *.test.mjs             Feature tests
lib/                     Shared, reusable, framework-light code
db/migrations/           Versioned SQL migrations (up + down)
scripts/                 Operator scripts (migrate, seed)
docs/                    Product and engineering documentation
proxy.ts                 Optimistic route guard (Next.js 16 Proxy)
```

Feature code is imported through the `@/features/<feature>/...` alias. A
feature may import from `lib/`; features must not import each other's
internals. Promote a shared helper to `lib/` only when a second feature needs
it.

## Three layers

| Layer | Files | Rules |
| --- | --- | --- |
| Data | `*.repository.ts` | Parameterized SQL, mapping only. No business rules. |
| Logic | `*.service.ts`, `*.validation.ts` | Validation, rules, hashing, session creation. No SQL strings, no JSX. |
| Presentation | `app/**`, `components/**` | Rendering and form wiring. No SQL, no business rules inline. |

Data flows presentation → logic → data and back. A repository is never called
straight from a component.

## Database rules

- The database is a dumb store: no foreign keys, cascades, triggers, stored
  procedures, or business-rule check constraints.
- Every table has a surrogate primary key, `created_at`, and `updated_at`.
- Logical foreign keys are indexed only, and documented in the migration.
- Every schema change is a versioned migration with an `.up.sql` and
  `.down.sql`.
- Queries are parameterized and never use `SELECT *` in application code.

## Shared `lib/` rules

`lib/` contains code that is not specific to one feature and does not render
UI:

- `db.ts` — PostgreSQL pool.
- `logger.ts` — structured logging.
- `password.ts` — password hashing/verification.
- `token.ts` — opaque token creation and hashing.

Anything that knows about a single business domain stays in that feature.
When a helper is needed by two features, move it to `lib/` at that moment, not
before.

## Authentication summary

Opaque session tokens, hashed at rest, stored in an `httpOnly` cookie.
`proxy.ts` performs an optimistic cookie-presence redirect; the admin layout
performs the real database-backed check. See
[`features/simple-auth/technical-solution.md`](features/simple-auth/technical-solution.md).

## Request flow (admin)

1. Request `/admin/*`.
2. `proxy.ts` redirects to `/login` when the session cookie is absent.
3. `app/admin/layout.tsx` reads the cookie, validates the session in
   PostgreSQL, and redirects when it is invalid or expired.
4. `app/admin/page.tsx` renders. Sign-out posts a Server Action.
