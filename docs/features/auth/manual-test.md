# Auth — Manual Test

Run these checks against a fresh local environment:

```bash
npm run db:up
npm run db:migrate
npm run db:seed-admin
npm run dev
```

Use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from `.env`.

## 1. Anonymous access

1. Open `http://localhost:3000/admin`.
2. Expect a redirect to `/login`.
3. Open `http://localhost:3000/` and `http://localhost:3000/login`.
4. Expect both to load without signing in.

## 2. Invalid credentials

1. Enter a registered email with the wrong password.
2. Expect the message `Invalid email or password.` and no redirect.
3. Enter an unregistered email with any password.
4. Expect the same generic message.

## 3. Valid sign-in

1. Enter the seeded email and password.
2. Expect a redirect to `/admin` and the dashboard.
3. Reload the page; expect to stay signed in.
4. Inspect the `kima_session` cookie in DevTools: `HttpOnly` is checked and the
   value is not readable from `document.cookie`.

## 4. Sign-out

1. Click `Sign out`.
2. Expect a redirect to `/login`.
3. Press Back; expect `/admin` to redirect to `/login` again.

## 5. Forged and expired sessions

1. Set the `kima_session` cookie to any random value.
2. Open `/admin`; expect a redirect to `/login`.
3. In PostgreSQL, run
   `UPDATE sessions SET expires_at = now() - interval '1 minute' WHERE token_hash = '<hash>';`
4. Reload `/admin`; expect a redirect to `/login`.

## 6. Inactive user

1. Run `UPDATE users SET is_active = FALSE WHERE email = '<admin email>';`
2. Try to sign in; expect `Invalid email or password.`
3. Restore with `UPDATE users SET is_active = TRUE WHERE email = '<admin email>';`

## 7. Seed idempotency

1. Run `npm run db:seed-admin` twice.
2. Expect the second run to log `Admin user already exists` and create no
   duplicate.

## Automated equivalent

```bash
npm run test      # unit tests (no database)
npm run test:e2e  # Playwright, requires db:up and system Chrome
```
