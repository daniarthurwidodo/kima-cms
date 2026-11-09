import { execFileSync } from "node:child_process";

export const E2E_BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@kima.local",
  password: process.env.E2E_ADMIN_PASSWORD ?? "e2e-password-123",
  name: "E2E Administrator",
};

export default function globalSetup() {
  const env = {
    ...process.env,
    ADMIN_EMAIL: E2E_ADMIN.email,
    ADMIN_PASSWORD: E2E_ADMIN.password,
    ADMIN_NAME: E2E_ADMIN.name,
  };

  execFileSync("node", ["scripts/migrate.mjs"], { env, stdio: "inherit" });
  execFileSync("node", ["scripts/seed-admin.mjs"], { env, stdio: "inherit" });
}
