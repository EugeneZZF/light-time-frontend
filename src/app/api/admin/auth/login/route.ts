import {
  adminAccessTokenCookie,
  adminSessionCookie,
  createAdminSession,
} from "@/shared/lib/auth/adminSession";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

type LoginRequestBody = {
  email?: string;
  password?: string;
};

type LoginResponseBody = {
  accessToken?: string;
  user?: unknown;
  message?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginRequestBody;
  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const upstreamResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const responseText = await upstreamResponse.text();
  let responseData: LoginResponseBody | string | null = null;

  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseData = responseText;
  }

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        message:
          typeof responseData === "object" &&
          responseData !== null &&
          "message" in responseData &&
          typeof responseData.message === "string"
            ? responseData.message
            : "Login failed.",
      },
      { status: upstreamResponse.status },
    );
  }

  const accessToken =
    typeof responseData === "object" && responseData !== null
      ? responseData.accessToken
      : undefined;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Login succeeded but access token is missing." },
      { status: 502 },
    );
  }

  const session = await createAdminSession(email);
  const response = NextResponse.json({
    ok: true,
    user:
      typeof responseData === "object" && responseData !== null
        ? responseData.user ?? { email }
        : { email },
  });

  response.cookies.set(adminSessionCookie.name, session, {
    httpOnly: true,
    maxAge: adminSessionCookie.maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  response.cookies.set(adminAccessTokenCookie.name, accessToken, {
    httpOnly: true,
    maxAge: adminAccessTokenCookie.maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
