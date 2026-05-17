import { NextRequest, NextResponse } from "next/server";


const JIKAN_API_URL = process.env.JIKAN_API_URL;
console.log('[DEBUG] JIKAN_API_URL:', JIKAN_API_URL);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get("path") || "/anime";
  const params = new URLSearchParams(searchParams);
  params.delete("path");

  const url = `${JIKAN_API_URL}${path}?${params.toString()}`;
  console.log('[DEBUG] Fetching URL:', url);

  let res;
  try {
    res = await fetch(url);
  } catch (error) {
    console.error('[DEBUG] Fetch error:', error);
    return NextResponse.json({ error: `Fetch error: ${error}` }, { status: 500 });
  }

  if (!res.ok) {
    console.error('[DEBUG] Jikan API error:', res.status, res.statusText);
    return NextResponse.json(
      { error: `Jikan API error: ${res.status} ${res.statusText}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
