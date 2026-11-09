import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
} from "./auth.constants.ts";
import type { LoginInput } from "./auth.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALID_INPUT_MESSAGE = "Enter a valid email address and password.";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function parseLoginInput(
  formData: FormData,
): ValidationResult<LoginInput> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: INVALID_INPUT_MESSAGE };
  }

  if (!password || password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, error: INVALID_INPUT_MESSAGE };
  }

  return { ok: true, value: { email, password } };
}
