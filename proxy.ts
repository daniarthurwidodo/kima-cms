import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOGIN_PATH,
  SESSION_COOKIE_NAME,
} from "@/features/simple-auth/simple-auth.constants";

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) return NextResponse.next();

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
