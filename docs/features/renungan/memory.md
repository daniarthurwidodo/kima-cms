# Renungan — Memory

## Context

- 2026-11-09 — Assessed as a separate feature; nothing implemented yet.
- Fixed by the request: daily cadence, calendar-based editing, fields title /
  verse / scripture / description / image background, read over REST by a
  React Native app.
- Planned location: `features/renungan/`, `app/api/renungan/`,
  `docs/features/renungan/`.

## Decisions (proposed, not final)

- 2026-11-09 — Keep admin CRUD on Server Actions; expose only read-only REST
  for the mobile app. Two write surfaces would be unnecessary.
- 2026-11-09 — One row per `publish_date`, enforced in the service; a unique
  index is only a race guard, per the dumb-DB rule.
- 2026-11-09 — The editor's image URL always wins. A blank URL triggers an
  Openverse (keyless) search at save time; the result and its attribution are
  stored. No image API key is configured or shipped.
- 2026-11-09 — Store a hotlinked image URL plus attribution, not image
  binaries. The CMS does not proxy or re-host images.
- 2026-11-09 — Never fail the save because image resolution failed; the entry
  is stored without an image and the app shows a gradient.
- 2026-11-09 — Resolve "today" server-side with a fixed timezone, not the
  device clock.

## Open decisions

- Whether `verse` is the reference and `scripture` the passage text (assumed)
  or the reverse.
- Openverse is the chosen fallback; Wikimedia Commons is the alternative if
  results are poor. Pexels/Unsplash/Pixabay are out because they need a key.
- Which query feeds the fallback search (title only, verse only, or both)?
  Assessment suggests title first, verse as fallback.
- Public endpoint vs shared app key; recommendation is public read with rate
  limiting later, because a mobile binary cannot keep a secret.
- Who is responsible for the licence of an editor-supplied URL? Assumed the
  editor; Openverse results carry their own attribution.

## Gotchas to expect

- `DATE` columns come back from `pg` as strings; do not round-trip them through
  `Date` and timezones without care.
- `BIGINT` comes back as a string, consistent with the auth feature.
- A date-only model cannot express a "publish at 06:00" rule; that is a later
  read-time or scheduler change.
- Openverse anonymous search allows 20 requests/minute, 200/day, and at most
  20 results per page. Attribution is required for CC images.
- Openverse is only called on save with a blank image URL; the REST read path
  makes no third-party call.
- The editor URL is stored, never fetched by the server; the client loads it.
- Source image URLs can disappear if the uploader removes the file; the app
  needs the gradient fallback.
- The mobile app needs a fallback background because `imageUrl` is optional.

## Verification

- Not yet run. Implementation plan and checks are in `tasks.md` and
  `technical-solution.md`.
