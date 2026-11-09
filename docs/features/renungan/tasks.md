# Renungan — Tasks

Status: `[x]` done, `[ ]` next. Schema, core, admin UI, and REST API are
implemented; integration tests and the open decisions remain.

## Assessment

- [x] Write PRD, technical solution, tasks, and memory for the feature.
- [ ] Resolve the open questions in `prd.md` (verse/scripture meaning, image
      fallback source, API access model).
- [ ] Confirm the mobile app's expected JSON shape and background fallback.

## Schema

- [x] `0002_renungan` migration with the unique date index and down file.
- [ ] Migration runs cleanly on a fresh database and rolls back.

## Feature

- [x] Types, constants, and pure validation for date and fields.
- [x] Repository: find by date, list by month, insert, update.
- [x] Service: one-per-date rule, publish filtering, date resolution.
- [x] Optional image URL field with `http(s)` validation.
- [x] Openverse fallback when the image URL is empty: first result plus
      attribution, never failing the save.
- [x] Admin actions for create/update/unpublish.
- [x] Month calendar page with per-day status.
- [x] Date editor form with the image URL field and Openverse auto-fill.
- [x] Form action wiring in a `useRenunganForm` hook.

## API

- [x] `GET /api/renungan/daily` with configurable timezone.
- [x] `GET /api/renungan?date=YYYY-MM-DD`.
- [x] Stable `400`/`404` response shapes and cache headers.

## Verification

- [x] Unit tests for validation, image URL scheme, Openverse mapping, and
      calendar/date helpers.
- [x] Service tests for duplicate dates, draft filtering, and the Openverse
      fallback when the image URL is empty or the search fails.
- [x] Route tests for status codes and the timezone boundary.
- [x] Browser end-to-end flow: calendar create → REST read → daily override.
- [ ] Manual checklist for unpublish and mobile rendering (create/edit flow
      verified once in the browser).

## Next (after this iteration)

- [ ] Rate limiting for the public endpoint.
- [ ] Scheduled publish times instead of date-only publishing.
- [ ] Series or reading plans.
- [ ] Push notification when the day's renungan is available.
