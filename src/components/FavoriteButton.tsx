"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Anime } from "@/types/anime";

interface FavoriteButtonProps {
  anime: Anime;
}

export default function FavoriteButton({ anime }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(anime.mal_id);

  const handleToggle = () => {
    if (favorited) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-700"
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      {favorited ? (
        <HeartSolidIcon className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
