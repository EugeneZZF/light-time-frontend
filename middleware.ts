import {
  adminSessionCookie,
  verifyAdminSession,
} from "@/shared/lib/auth/adminSession";
import { NextRequest, NextResponse } from "next/server";

function buildLoginUrl(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);

  if (request.nextUrl.pathname !== "/admin/login") {
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
  }

  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(adminSessionCookie.name)?.value;
  const session = await verifyAdminSession(sessionCookie);
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !session
  ) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
