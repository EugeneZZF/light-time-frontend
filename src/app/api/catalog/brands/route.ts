import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function GET() {
  if (!baseUrl) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const upstreamResponse = await fetch(`${baseUrl}/api/catalog/brands`, {
      next: { revalidate: 60 * 60 },
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json([], { status: upstreamResponse.status });
    }

    const brands = await upstreamResponse.json();

    return NextResponse.json(brands);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
