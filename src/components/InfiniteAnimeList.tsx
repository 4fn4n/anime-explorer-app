"use client";

import { useCallback, useEffect, useRef } from "react";
import { Anime, PaginationInfo } from "@/types/anime";
import AnimeGrid from "@/components/AnimeGrid";
import { useAnimeListStore } from "@/store/animeListStore";

interface InfiniteAnimeListProps {
  initialData: Anime[];
  initialPagination: PaginationInfo;
  filters: {
    q?: string;
    type?: string;
    rating?: string;
    genres?: string;
    limit?: number;
  };
}

export default function InfiniteAnimeList({
  initialData,
  initialPagination,
  filters,
}: InfiniteAnimeListProps) {
  const { anime, hasNextPage, loading, setInitialData, loadMore } =
    useAnimeListStore();
  const endPageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInitialData(initialData, initialPagination);
  }, [initialData, initialPagination, setInitialData]);

  const handleLoadMore = useCallback(() => {
    loadMore(filters);
  }, [loadMore, filters]);

  useEffect(() => {
    const endPageRefStatus = endPageRef.current;
    if (!endPageRefStatus) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(endPageRefStatus);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <>
      <AnimeGrid anime={anime} />

      {hasNextPage && (
        <div ref={endPageRef} className="mt-8 flex items-center justify-center py-4">
          {loading && (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          )}
        </div>
      )}

      {!hasNextPage && anime.length > 0 && (
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          You&apos;ve reached the end
        </p>
      )}
    </>
  );
}
