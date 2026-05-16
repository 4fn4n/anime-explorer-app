"use client";

import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/store/favoritesStore";
import AnimeGrid from "@/components/AnimeGrid";
import EmptyState from "@/components/EmptyState";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-6 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Favorites
        </h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Favorites ({favorites.length})
        </h1>
        <button
          onClick={clearFavorites}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear All
        </button>
      </div>
      <AnimeGrid anime={favorites} />
    </div>
  );
}
