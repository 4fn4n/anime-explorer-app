"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { Anime } from "@/types/anime";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const imageUrl =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";

  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group block rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-t-lg">
        <Image
          src={imageUrl}
          alt={anime.title || "Anime Image"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {anime.score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-sm font-semibold text-yellow-400">
            <StarIcon className="h-3.5 w-3.5" />
            {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {anime.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          {anime.type && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {anime.type}
            </span>
          )}
          {anime.episodes && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {anime.episodes} eps
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
