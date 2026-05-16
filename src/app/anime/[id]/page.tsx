import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAnimeById } from "@/services/jikan";
import AnimeDetail from "@/components/AnimeDetail";

export const revalidate = 3600; // 1 hour

interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AnimeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const anime = await getAnimeById(Number(id));
    return {
      title: `${anime.title} | Anime Explorer`,
      description: anime.synopsis?.slice(0, 160) || `Details for ${anime.title}`,
    };
  } catch {
    return { title: "Anime Not Found | Anime Explorer" };
  }
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const animeDetailType = await getAnimeById(numericId).catch(() => notFound());

  return <AnimeDetail animeDetailType={animeDetailType} />;
}
