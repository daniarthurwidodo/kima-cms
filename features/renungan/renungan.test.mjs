import assert from "node:assert/strict";
import { test } from "node:test";
import { findOpenverseImage } from "./renungan.image.ts";
import {
  formatDateInTimeZone,
  resolveRenunganImage,
} from "./renungan.service.ts";
import {
  getMonthGrid,
  parseYearMonth,
  shiftMonth,
} from "./renungan.calendar.ts";
import {
  parsePublishDate,
  parseRenunganInput,
} from "./renungan.validation.ts";

const VALID_INPUT = {
  publishDate: "2026-11-09",
  title: "Setia dalam Hal Kecil",
  verse: "Lukas 16:10",
  scripture: "Barangsiapa setia dalam perkara-perkara kecil...",
  description: "Renungan hari ini.",
  isPublished: true,
};

test("parsePublishDate accepts a real calendar date", () => {
  assert.strictEqual(parsePublishDate("2026-11-09"), "2026-11-09");
});

test("parsePublishDate rejects impossible or malformed dates", () => {
  assert.strictEqual(parsePublishDate("2026-02-31"), null);
  assert.strictEqual(parsePublishDate("2026-13-01"), null);
  assert.strictEqual(parsePublishDate("09-11-2026"), null);
});

test("parseRenunganInput trims fields and keeps an image URL", () => {
  const result = parseRenunganInput({
    ...VALID_INPUT,
    title: "  Setia dalam Hal Kecil  ",
    imageUrl: " https://example.com/photo.jpg ",
  });

  assert.deepStrictEqual(result, {
    ok: true,
    value: {
      ...VALID_INPUT,
      imageUrl: "https://example.com/photo.jpg",
    },
  });
});

test("parseRenunganInput treats an empty image URL as null", () => {
  const result = parseRenunganInput({ ...VALID_INPUT, imageUrl: "  " });

  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.value.imageUrl, null);
});

test("parseRenunganInput rejects a missing required field", () => {
  const result = parseRenunganInput({ ...VALID_INPUT, title: "" });

  assert.strictEqual(result.ok, false);
});

test("parseRenunganInput rejects a non-http image URL", () => {
  const result = parseRenunganInput({
    ...VALID_INPUT,
    imageUrl: "javascript:alert(1)",
  });

  assert.strictEqual(result.ok, false);
});

test("parseRenunganInput rejects an oversized title", () => {
  const result = parseRenunganInput({
    ...VALID_INPUT,
    title: "x".repeat(121),
  });

  assert.strictEqual(result.ok, false);
});

test("formatDateInTimeZone resolves the Jakarta day boundary", () => {
  assert.strictEqual(
    formatDateInTimeZone(new Date("2026-11-09T16:30:00Z"), "Asia/Jakarta"),
    "2026-11-09",
  );
  assert.strictEqual(
    formatDateInTimeZone(new Date("2026-11-09T17:30:00Z"), "Asia/Jakarta"),
    "2026-11-10",
  );
});

test("resolveRenunganImage keeps an editor-supplied URL", async () => {
  const image = await resolveRenunganImage({
    ...VALID_INPUT,
    imageUrl: "https://example.com/photo.jpg",
  });

  assert.deepStrictEqual(image, {
    imageUrl: "https://example.com/photo.jpg",
    imageAttribution: null,
  });
});

test("findOpenverseImage maps the first result", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        results: [
          {
            url: "https://example.com/openverse.jpg",
            attribution: "Photo by Jane Doe, CC BY 2.0, via Openverse",
          },
        ],
      }),
      { status: 200 },
    );

  try {
    assert.deepStrictEqual(await findOpenverseImage("faith"), {
      imageUrl: "https://example.com/openverse.jpg",
      imageAttribution: "Photo by Jane Doe, CC BY 2.0, via Openverse",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("findOpenverseImage returns null when the search fails", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("network down");
  };

  try {
    assert.strictEqual(await findOpenverseImage("faith"), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("parseRenunganInput defaults isPublished to true", () => {
  const result = parseRenunganInput(VALID_INPUT);

  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.value.isPublished, true);
});

test("parseYearMonth rejects a malformed or impossible month", () => {
  assert.strictEqual(parseYearMonth("2026-11"), "2026-11");
  assert.strictEqual(parseYearMonth("2026-13"), null);
  assert.strictEqual(parseYearMonth("11-2026"), null);
});

test("shiftMonth crosses year boundaries", () => {
  assert.strictEqual(shiftMonth("2026-12", 1), "2027-01");
  assert.strictEqual(shiftMonth("2026-01", -1), "2025-12");
});

test("getMonthGrid pads the first week and starts on the right day", () => {
  const grid = getMonthGrid("2026-09");

  assert.strictEqual(grid[0], null);
  assert.strictEqual(grid[1], null);
  assert.deepStrictEqual(grid[2], { date: "2026-09-01", dayNumber: 1 });
  assert.strictEqual(grid.length % 7, 0);
});
