"use server";

import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  ADMIN_PATH,
  LOGIN_ERROR_MESSAGE,
  LOGIN_FAILED_MESSAGE,
  LOGIN_PATH,
} from "./simple-auth.constants";
import { authenticate, endSession } from "./simple-auth.service";
import {
  clearSessionCookie,
  getSessionToken,
  setSessionCookie,
} from "./simple-auth.session";
import { parseLoginInput } from "./simple-auth.validation";

export type LoginState = { error?: string };

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsedInput = parseLoginInput(formData);
  if (!parsedInput.ok) return { error: parsedInput.error };

  try {
    const session = await authenticate(getPool(), parsedInput.value);
    if (!session) return { error: LOGIN_FAILED_MESSAGE };

    await setSessionCookie(session.token, session.expiresAt);
  } catch (error) {
    logger.error({ err: error }, "Login failed");
    return { error: LOGIN_ERROR_MESSAGE };
  }

  redirect(ADMIN_PATH);
}

export async function logoutAction(): Promise<void> {
  try {
    const token = await getSessionToken();
    if (token) await endSession(getPool(), token);
  } catch (error) {
    logger.error({ err: error }, "Logout failed");
  }

  await clearSessionCookie();
  redirect(LOGIN_PATH);
}
