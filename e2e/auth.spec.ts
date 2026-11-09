import { expect, test } from "@playwright/test";
import { E2E_ADMIN, E2E_BASE_URL } from "./global-setup";

test("redirects anonymous visitors to the login page", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("rejects a forged session cookie", async ({ context, page }) => {
  await context.addCookies([
    {
      name: "kima_session",
      value: "forged-session-token",
      url: new URL(E2E_BASE_URL).origin,
    },
  ]);

  await page.goto("/admin");

  await expect(page).toHaveURL(/\/login$/);
});

test("shows a generic error for invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(E2E_ADMIN.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(
    page.getByText("Invalid email or password.", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("signs in, opens the admin workspace, and signs out", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(E2E_ADMIN.email);
  await page.getByLabel("Password").fill(E2E_ADMIN.password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Good morning",
  );

  await page.getByRole("button", { name: "Sign out" }).click();

  await expect(page).toHaveURL(/\/login$/);
});
