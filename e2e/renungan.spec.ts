import { expect, test } from "@playwright/test";
import { getPool } from "../lib/db";
import { loadEnv } from "../scripts/load-env.mjs";
import { signIn } from "./sign-in";

const TEST_DATE = "2099-11-20";
const TEST_TITLE = "E2E Renungan";

loadEnv();

test.afterAll(async () => {
  await getPool().query("DELETE FROM renungan WHERE publish_date = $1", [
    TEST_DATE,
  ]);
  await getPool().end();
});

test("creates a renungan from the calendar and serves it over REST", async ({
  page,
}) => {
  await signIn(page);
  await page.goto(`/admin/renungan/${TEST_DATE}`);

  await page.getByLabel("Title").fill(TEST_TITLE);
  await page.getByLabel("Verse").fill("Yohanes 3:16");
  await page
    .getByLabel("Scripture")
    .fill("Karena begitu besar kasih Allah akan dunia ini...");
  await page.getByLabel("Description").fill("E2E renungan body.");
  await page
    .getByLabel("Image URL")
    .fill("https://example.com/e2e-background.jpg");
  await page.getByRole("button", { name: "Save renungan" }).click();

  await expect(page).toHaveURL(/\/admin\/renungan\?month=2099-11$/);
  await expect(page.getByText(TEST_TITLE)).toBeVisible();

  const byDate = await page.request.get(`/api/renungan?date=${TEST_DATE}`);
  expect(byDate.status()).toBe(200);
  expect(byDate.headers()["cache-control"]).toContain("max-age=60");

  const byDateBody = await byDate.json();
  expect(byDateBody.title).toBe(TEST_TITLE);
  expect(byDateBody.imageUrl).toBe("https://example.com/e2e-background.jpg");

  const dailyOverride = await page.request.get(
    `/api/renungan/daily?date=${TEST_DATE}`,
  );
  expect(dailyOverride.status()).toBe(200);
  expect((await dailyOverride.json()).title).toBe(TEST_TITLE);
});

test("returns stable errors for bad or missing dates", async ({ request }) => {
  expect((await request.get("/api/renungan")).status()).toBe(400);
  expect((await request.get("/api/renungan?date=2099-02-31")).status()).toBe(
    400,
  );
  expect((await request.get("/api/renungan?date=2099-11-21")).status()).toBe(
    404,
  );
});

test("daily endpoint never fails with a server error", async ({ request }) => {
  const response = await request.get("/api/renungan/daily");

  expect([200, 404]).toContain(response.status());
  const body = await response.json();

  if (response.status() === 200) {
    expect(body.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  } else {
    expect(typeof body.error).toBe("string");
  }
});
