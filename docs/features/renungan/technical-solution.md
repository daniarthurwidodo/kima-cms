# Renungan — Technical Solution (Assessment)

This is an assessment, not an implementation. It fits the existing modular
monolith: `features/renungan/` for data, logic, and admin UI; `app/api/renungan/`
for the REST surface; the React Native app is an external consumer.

## Data model

Proposed migration: `db/migrations/0002_renungan.{up,down}.sql`.

### `renungan`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `BIGSERIAL` | Surrogate PK. |
| `publish_date` | `DATE` | One entry per day; unique index as a race guard. |
| `title` | `TEXT` | Required. |
| `verse` | `TEXT` | Required; verse reference shown under the title. |
| `scripture` | `TEXT` | Required; quoted passage text. |
| `description` | `TEXT` | Required; devotional body. |
| `image_url` | `TEXT` | Nullable; editor URL or resolved Openverse URL. |
| `image_attribution` | `TEXT` | Nullable; set for Openverse results. |
| `is_published` | `BOOLEAN` | Drafts stay hidden from the public API. |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | Audit columns. |

Indexes: unique `idx_renungan_publish_date`, plus
`idx_renungan_published_date (is_published, publish_date)` for the daily
lookup. No foreign keys — the table has no relations in this iteration.

## REST API

Public, read-only. The admin side keeps using Server Actions, so only the
mobile consumer needs REST.

| Method + path | Purpose |
| --- | --- |
| `GET /api/renungan/daily` | Today's published entry in the configured timezone. |
| `GET /api/renungan?date=YYYY-MM-DD` | Entry for an explicit date. |

Response (`200`):

```json
{
  "date": "2026-11-09",
  "title": "Setia dalam Hal Kecil",
  "verse": "Lukas 16:10",
  "scripture": "Barangsiapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar.",
  "description": "...",
  "imageUrl": "https://live.staticflickr.com/.../photo.jpg",
  "imageAttribution": "Photo by Jane Doe, CC BY 2.0, via Openverse"
}
```

- Missing/invalid date → `400`; no entry for the date → `404`.
- `daily` resolves `new Date()` in a fixed timezone (`RENUNGAN_TIMEZONE`,
  default `Asia/Jakarta`) so the app does not depend on device time.
- An optional `date` query on `daily` lets the app request a specific day
  without a second endpoint contract.
- Cache with `Cache-Control: public, max-age=60, stale-while-revalidate=...`;
  the content changes at most once per day.
- Native apps ignore CORS; the endpoint stays same-origin by default. Add CORS
  only if a web preview also consumes it.
- No API key: a mobile bundle cannot keep one secret. Abuse protection is
  deferred to rate limiting at the edge.

## Admin workflow

- `app/admin/renungan/page.tsx` renders a month calendar.
- Each day links to `/admin/renungan/[date]` with that date's editor.
- The editor is a Server Action form: title, verse, scripture, description,
  image URL (optional), publish toggle. A blank image URL triggers the
  Openverse fallback on save.
- Saving validates input in `renungan.validation.ts`, then the service enforces
  one-per-date and upserts by `publish_date`.
- `is_published` defaults to true; the editor can unpublish a past entry.

## Image background

The editor can paste an image URL. When it is empty, the server resolves one
from Openverse (no API key) at save time and stores it with attribution.

| Option | Decision |
| --- | --- |
| Openverse API | **Chosen** for the empty-URL fallback: no key, CC search, anonymous use. |
| Wikimedia Commons | Alternative if Openverse results are poor. |
| Pexels / Unsplash / Pixabay | Rejected: require an API key. |
| Editor URL only | Not enough: the request asks for an Openverse fallback. |

Flow:

1. Editor pastes an optional absolute `http(s)` image URL.
2. `renungan.validation.ts` validates it when present; other schemes are
   rejected.
3. On save, if the field is empty, `renungan.image.ts` searches Openverse
   anonymously using the entry's title/verse and takes the first photo result.
4. The CMS stores `image_url` and, for Openverse results, `image_attribution`
   (creator + licence + provider). An editor URL leaves attribution null.
5. An Openverse error, rate limit, or empty result does not fail the save: the
   entry is stored with `image_url = null` and the app shows its gradient.
6. The app reads `imageUrl`, renders it with a dark overlay, and shows
   `imageAttribution` where the screen allows.

Rules:

- No key or secret exists to configure. Only Openverse is called, server-side,
  at save time; the REST read path makes no third-party call.
- Openverse anonymous limits: 20 requests/minute, 200/day, and 20 results per
  page. One search per save with a blank image stays well under them.
- Skip results without a usable image URL; prefer landscape/photo results.
- Store the full-size `url`, not the thumbnail, because it is a screen
  background. Hotlink; do not download or re-host.
- The server never fetches the editor-supplied URL, so that field adds no SSRF
  surface.
- A source URL can disappear if the uploader removes the image; the app's
  gradient fallback covers that case.

## Files (planned)

| File | Responsibility |
| --- | --- |
| `features/renungan/renungan.constants.ts` | Timezone, field limits, messages. |
| `features/renungan/renungan.types.ts` | `Renungan`, `RenunganInput`, `RenunganResponse`. |
| `features/renungan/renungan.validation.ts` | Pure date/field parsing. |
| `features/renungan/renungan.repository.ts` | Parameterized SQL, row mapping. |
| `features/renungan/renungan.service.ts` | One-per-date, publish rules, upsert. |
| `features/renungan/renungan.image.ts` | Openverse fallback search + attribution mapping. |
| `features/renungan/renungan.actions.ts` | Admin create/update actions. |
| `features/renungan/components/` | Calendar and editor UI. |
| `app/api/renungan/daily/route.ts` | Daily handler. |
| `app/api/renungan/route.ts` | Date handler. |

## Security and limits

- Admin actions require the existing session (same guard as `/admin`).
- The public API validates the `date` format and never reflects input into SQL
  or logs.
- The editor-supplied image URL is validated and stored, never fetched
  server-side. The Openverse call targets a fixed host, so no SSRF comes from
  user input.
- No PII in renungan; image attribution is public by design.
- Known limit: a public endpoint can be scraped; add edge rate limiting when
  traffic justifies it.
- Known limit: Openverse anonymous search is rate-limited; a failed search
  leaves the entry without an image rather than blocking the save.
- Known limit: `publish_date` is a calendar date, not a timestamp, so
  "publish at 00:00" is a read-time rule, not a scheduled job.

## Verification plan

| Check | How |
| --- | --- |
| Validation | Unit tests for date parsing, required fields, and the image URL scheme. |
| Service | Tests for duplicate-date rejection, draft filtering, and the Openverse fallback (including a failed search). |
| API | Route tests for `200`/`400`/`404` and the daily timezone boundary. |
| Admin | Manual check: create with a URL, create with a blank URL (auto-fill), edit, unpublish, duplicate date. |
| Mobile | Manual check: background image, attribution, broken-image fallback. |

Prerequisites at implementation time: migration applied, Openverse reachable,
and the existing auth guard in place.
