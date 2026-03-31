import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function forwardRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
) {
  if (!baseUrl) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const targetUrl = new URL(
    `/api/admin/${path.join("/")}${request.nextUrl.search}`,
    baseUrl,
  );
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  headers.set("Authorization", `Bearer ${accessToken}`);

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: requestBody ? new Uint8Array(requestBody) : undefined,
    cache: "no-store",
  });

  const responseText = await upstreamResponse.text();
  const response = new NextResponse(responseText, {
    status: upstreamResponse.status,
  });
  const upstreamContentType = upstreamResponse.headers.get("content-type");

  if (upstreamContentType) {
    response.headers.set("Content-Type", upstreamContentType);
  }

  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context.params);
}
