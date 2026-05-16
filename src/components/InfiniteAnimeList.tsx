"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Anime, PaginationInfo } from "@/types/anime";
import AnimeGrid from "@/components/AnimeGrid";

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
  const [anime, setAnime] = useState<Anime[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialPagination.has_next_page);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Reset when filters change
  useEffect(() => {
    setAnime(initialData);
    setPage(1);
    setHasNextPage(initialPagination.has_next_page);
  }, [initialData, initialPagination]);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    const nextPage = page + 1;

    const params = new URLSearchParams();
    params.set("path", "/anime");
    params.set("page", String(nextPage));
    params.set("limit", String(filters.limit || 12));
    if (filters.q) params.set("q", filters.q);
    if (filters.type) params.set("type", filters.type);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.genres) params.set("genres", filters.genres);

    try {
      const res = await fetch(`/api/jikan?${params.toString()}`);
      const data = await res.json();

      setAnime((prev) => [...prev, ...data.data]);
      setPage(nextPage);
      setHasNextPage(data.pagination.has_next_page);
    } catch (error) {
      console.error("Failed to load more anime:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, page, filters]);

  // Intersection Observer
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <AnimeGrid anime={anime} />

      {hasNextPage && (
        <div ref={observerRef} className="mt-8 flex items-center justify-center py-4">
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
