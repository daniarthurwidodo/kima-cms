# Renungan — PRD

## Problem

Kima CMS manages general content but has no way to publish a daily devotional
("renungan") that the React Native mobile app can display. Editors need a
date-based workflow, and the app needs a simple REST endpoint it can call every
day to get the current entry with a background image.

## Scope (this iteration)

- One renungan per calendar date, created and edited from an admin calendar.
- Fields: title, verse, scripture, description, and a background image.
- The background image is an optional URL pasted by the editor. When it is
  empty, the CMS resolves one from Openverse (keyless) at save time and stores
  that URL with its attribution. The CMS never hosts, downloads, or re-serves
  the image.
- A read-only REST API returns the renungan for a date, including a "daily"
  endpoint the mobile app calls on open.
- The React Native app renders the image as the screen background.

## Out of scope

- Multiple renungan per day, series/plans, categories, tags, or search.
- Push notifications, scheduling jobs, or automatic publishing at midnight.
- Localized/multi-language content.
- Image editing, cropping, or storage of image binaries in Kima.
- Public user accounts or per-user reading history.

## Users

| User | Need |
| --- | --- |
| Editor | Pick a date on a calendar and fill in that day's renungan. |
| Mobile app | Fetch today's renungan over REST and show it with a background. |
| Operator | Configure the daily timezone. |

## Requirements

1. A date has at most one renungan; saving a second entry for the same date is
   rejected by the service layer.
2. The admin calendar shows which dates already have content and opens an
   editor for the selected date.
3. Title, verse, scripture, and description are required; the image is
   optional with a documented fallback.
4. The editor may supply an absolute `http(s)` image URL, which is stored as-is
   and always wins. When the field is empty, the server searches Openverse
   anonymously (no key) using the entry's title/verse and stores the first
   result with its attribution. If that search fails, the entry still saves
   with no image. The server never fetches the editor-supplied URL.
5. `GET /api/renungan/daily` returns today's published entry (or a documented
   `404`/empty response), resolved in a configured timezone.
6. `GET /api/renungan?date=YYYY-MM-DD` returns the entry for an explicit date,
   for pre-loading and client caching.
7. The API never returns drafts or rows with an empty required field.
8. Responses include `imageUrl` and `imageAttribution` when the entry has them;
   the app uses the image as the background and falls back to a gradient when
   it is missing or fails to load.

## Acceptance criteria

- [ ] Editor creates a renungan for a date and sees it on the calendar.
- [ ] Saving a second renungan for the same date fails with a clear message.
- [ ] `GET /api/renungan/daily` returns the expected JSON for the configured
      timezone.
- [ ] Requesting a date with no entry returns `404` with a stable shape.
- [ ] Saving a non-`http(s)` image URL is rejected with a clear message.
- [ ] Leaving the image URL empty stores an Openverse image and its
      attribution.
- [ ] An Openverse failure still saves the entry, with no image and a gradient
      fallback on the client.
- [ ] Draft/unpublished entries are never returned by the public API.
- [ ] The mobile app can use `imageUrl` as a full-screen background.

## Open questions

- Do "verse" and "scripture" mean the reference (e.g. `Yohanes 3:16`) and the
  passage text, or the reverse? This assessment assumes:
  - `verse` = reference/label shown under the title.
  - `scripture` = the quoted passage text.
- Image fallback source: Openverse (keyless) is chosen; Wikimedia Commons is
  the alternative if Openverse results are poor.
- Is the API public (no key) or does the app send a shared app key? A mobile
  app cannot keep a secret, so the assessment recommends public read with
  rate limiting later.
- Who is responsible for the licence of an editor-supplied URL? Assumed the
  editor; Openverse results carry their own attribution.
