import { adminSessionCookie } from "@/shared/lib/auth/adminSession";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const response = NextResponse.redirect(
  //   new URL("/admin/login", request.url),
  //   303,
  // );

  const response = NextResponse.json({ success: true });

  response.cookies.set(adminSessionCookie.name, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
