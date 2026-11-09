# Renungan — Tasks

Status: `[x]` done, `[ ]` next. Nothing is implemented yet; this is the
assessment backlog in suggested order.

## Assessment

- [x] Write PRD, technical solution, tasks, and memory for the feature.
- [ ] Resolve the open questions in `prd.md` (verse/scripture meaning, image
      fallback source, API access model).
- [ ] Confirm the mobile app's expected JSON shape and background fallback.

## Schema

- [ ] `0002_renungan` migration with the unique date index and down file.
- [ ] Migration runs cleanly on a fresh database and rolls back.

## Feature

- [ ] Types, constants, and pure validation for date and fields.
- [ ] Repository: find by date, list by month, upsert.
- [ ] Service: one-per-date rule, publish filtering, date resolution.
- [ ] Optional image URL field with `http(s)` validation.
- [ ] Openverse fallback when the image URL is empty: first result plus
      attribution, never failing the save.
- [ ] Admin actions for create/update/unpublish.
- [ ] Month calendar page with per-day status.
- [ ] Date editor form with the image URL field and Openverse auto-fill.

## API

- [ ] `GET /api/renungan/daily` with configurable timezone.
- [ ] `GET /api/renungan?date=YYYY-MM-DD`.
- [ ] Stable `400`/`404` response shapes and cache headers.

## Verification

- [ ] Unit tests for validation, including the image URL scheme.
- [ ] Service tests for duplicate dates, draft filtering, and the Openverse
      fallback when the image URL is empty or the search fails.
- [ ] Route tests for status codes and the timezone boundary.
- [ ] Manual checklist for admin create/edit/unpublish and mobile rendering.

## Next (after this iteration)

- [ ] Rate limiting for the public endpoint.
- [ ] Scheduled publish times instead of date-only publishing.
- [ ] Series or reading plans.
- [ ] Push notification when the day's renungan is available.
