import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { getPool } from "../../lib/db.ts";
import { loadEnv } from "../../scripts/load-env.mjs";
import {
  RenunganDateTakenError,
  createRenungan,
  getPublishedRenunganByDate,
  getRenunganByDate,
  updateRenunganById,
} from "./renungan.service.ts";

loadEnv();

const hasDatabase = Boolean(process.env.DATABASE_URL);
const skip = hasDatabase ? false : "DATABASE_URL is not configured";

const TEST_DATES = [
  "2099-12-01",
  "2099-12-02",
  "2099-12-03",
  "2099-12-04",
  "2099-12-05",
];

function createInput(overrides = {}) {
  return {
    publishDate: TEST_DATES[0],
    title: "Integration Renungan",
    verse: "Yohanes 3:16",
    scripture: "Karena begitu besar kasih Allah akan dunia ini...",
    description: "Integration test body.",
    imageUrl: "https://example.com/bg.jpg",
    isPublished: true,
    ...overrides,
  };
}

async function cleanup() {
  await getPool().query(
    "DELETE FROM renungan WHERE publish_date IN ($1, $2, $3, $4, $5)",
    TEST_DATES,
  );
}

before(async () => {
  if (hasDatabase) await cleanup();
});

after(async () => {
  if (!hasDatabase) return;
  await cleanup();
  await getPool().end();
});

test("createRenungan stores and publishes an entry", { skip }, async () => {
  const created = await createRenungan(getPool(), createInput());

  assert.strictEqual(created.publishDate, TEST_DATES[0]);
  assert.strictEqual(created.isPublished, true);

  const found = await getPublishedRenunganByDate(getPool(), TEST_DATES[0]);
  assert.strictEqual(found?.title, "Integration Renungan");
});

test("createRenungan rejects a duplicate date", { skip }, async () => {
  await assert.rejects(
    createRenungan(getPool(), createInput()),
    RenunganDateTakenError,
  );
});

test("drafts are hidden from the published lookup", { skip }, async () => {
  await createRenungan(
    getPool(),
    createInput({ publishDate: TEST_DATES[1], isPublished: false }),
  );

  assert.strictEqual(
    await getPublishedRenunganByDate(getPool(), TEST_DATES[1]),
    null,
  );
  assert.strictEqual(
    (await getRenunganByDate(getPool(), TEST_DATES[1]))?.isPublished,
    false,
  );
});

test("updateRenunganById can unpublish an entry", { skip }, async () => {
  const created = await createRenungan(
    getPool(),
    createInput({ publishDate: TEST_DATES[2] }),
  );

  const updated = await updateRenunganById(getPool(), created.id, {
    ...createInput({ publishDate: TEST_DATES[2] }),
    title: "Updated Renungan",
    isPublished: false,
  });

  assert.strictEqual(updated?.title, "Updated Renungan");
  assert.strictEqual(updated?.isPublished, false);
  assert.strictEqual(
    await getPublishedRenunganByDate(getPool(), TEST_DATES[2]),
    null,
  );
});

test("a blank image URL falls back to Openverse", { skip }, async () => {
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
    const created = await createRenungan(
      getPool(),
      createInput({ publishDate: TEST_DATES[3], imageUrl: null }),
    );

    assert.strictEqual(created.imageUrl, "https://example.com/openverse.jpg");
    assert.strictEqual(
      created.imageAttribution,
      "Photo by Jane Doe, CC BY 2.0, via Openverse",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("a failed image search still saves the entry", { skip }, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("network down");
  };

  try {
    const created = await createRenungan(
      getPool(),
      createInput({ publishDate: TEST_DATES[4], imageUrl: null }),
    );

    assert.strictEqual(created.imageUrl, null);
    assert.strictEqual(created.imageAttribution, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
