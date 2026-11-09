# Kima CMS — Product Requirements (Root)

## Product

Kima CMS is a content management workspace: content, media, users, comments,
and settings. The current app is an early Next.js 16 App Router scaffold.

## Goals

1. **Modular monolith.** One deployable app, internally split by feature so
   teams can change one feature without reading the whole codebase.
2. **Feature-based organization.** Each feature owns its data access, business
   logic, UI, and tests under `features/<name>/`.
3. **Reusable shared layer.** Cross-feature code lives in `lib/` and is
   framework-light, so it can later move to an internal package.
4. **Simple authentication.** Only known users can reach the admin workspace.

## Non-goals (for this iteration)

- Public sign-up, OAuth, SSO, MFA, email verification, password reset.
- Role/permission model beyond `is_active`.
- Microservices, monorepo workspaces, or a separate package registry.
- A full migration framework (a small SQL runner is enough).

## Users

| User | Need |
| --- | --- |
| Admin/editor | Sign in and use the admin workspace. |
| Developer | Add or change one feature without touching unrelated features. |
| Operator | Start the app, apply migrations, and seed the first admin. |

## Success criteria

- `npm run db:migrate` creates the auth schema.
- `npm run db:seed-admin` creates one admin idempotently.
- Unauthenticated `/admin` requests redirect to `/login`.
- Valid credentials open `/admin`; invalid credentials show one generic error.
- Signing out deletes the server session and returns to `/login`.
- Feature and shared code passes lint, type-check, unit tests, and `next build`.
