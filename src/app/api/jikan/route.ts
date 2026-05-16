import { NextRequest, NextResponse } from "next/server";

const JIKAN_API_URL = process.env.JIKAN_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get("path") || "/anime";
  const params = new URLSearchParams(searchParams);
  params.delete("path");

  const url = `${JIKAN_API_URL}${path}?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json(
      { error: `Jikan API error: ${res.status} ${res.statusText}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
