import { AnimeListResponse, AnimeDetail } from "@/types/anime";

const INTERNAL_API = "/api/jikan";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

interface FetchAnimeListParams {
  page?: number;
  limit?: number;
  q?: string;
  type?: string;
  rating?: string;
  genres?: string;
}

export async function getAnimeList(
  params: FetchAnimeListParams = {}
): Promise<AnimeListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("path", "/anime");

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.q) searchParams.set("q", params.q);
  if (params.type) searchParams.set("type", params.type);
  if (params.rating) searchParams.set("rating", params.rating);
  if (params.genres) searchParams.set("genres", params.genres);

  const url = `${getBaseUrl()}${INTERNAL_API}?${searchParams.toString()}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch anime list: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getAnimeById(id: number): Promise<AnimeDetail> {
  const searchParams = new URLSearchParams();
  searchParams.set("path", `/anime/${id}/full`);

  const url = `${getBaseUrl()}${INTERNAL_API}?${searchParams.toString()}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Failed to fetch anime ${id}: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.data;
}
