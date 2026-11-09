# Simple Auth — PRD

## Problem

The admin workspace is currently public. Kima CMS needs a minimal way to prove
who a user is before showing it.

## Scope (this iteration)

- Email + password sign-in.
- One admin account seeded from environment variables.
- Session persists for 7 days in a secure, `httpOnly` cookie.
- `/admin/*` requires a valid session.
- Sign-out deletes the server session.

## Out of scope

- Public registration, OAuth, SSO, MFA, email verification, password reset.
- Roles and fine-grained permissions.
- Remember-me duration choices or multi-device session management UI.

## Requirements

1. Credentials are validated on the server; the client never sees hashes.
2. Unknown email and wrong password produce the same generic error.
3. Only active users can authenticate.
4. Raw session tokens are never stored in the database.
5. Redirects are optimistic at the proxy and authoritative in the layout.
6. The seeded admin script is idempotent.

## Acceptance criteria

- [x] `/admin` without a cookie redirects to `/login`.
- [x] `/admin` with a forged cookie redirects to `/login`.
- [x] Valid credentials set a cookie and land on `/admin`.
- [x] Invalid credentials show one generic error and set no cookie.
- [x] Sign-out removes the session row and the cookie.
- [x] Expired or inactive-user sessions are rejected.
