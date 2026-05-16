"use client";

import type { Anime } from "@/types/anime";
import AnimeCard from "./AnimeCard";

export default function AnimeGrid({ anime }: { anime: Anime[] }) {
  if (anime) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {anime.map((item, index) => (
          <AnimeCard key={index} anime={item} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No anime found.
        </p>
      </div>
    );
  }
}
