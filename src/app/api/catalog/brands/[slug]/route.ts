import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!baseUrl) {
    return NextResponse.json(null, { status: 404 });
  }

  const { slug } = await context.params;

  try {
    const upstreamResponse = await fetch(
      `${baseUrl}/api/catalog/brands/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 * 60 },
      },
    );

    if (upstreamResponse.status === 404) {
      return NextResponse.json(null, { status: 404 });
    }

    if (!upstreamResponse.ok) {
      return NextResponse.json(null, { status: upstreamResponse.status });
    }

    const brand = await upstreamResponse.json();

    return NextResponse.json(brand);
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
