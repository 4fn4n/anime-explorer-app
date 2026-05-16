"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Genre } from "@/types/anime";
import { useSearchStore } from "@/store/searchStore";
import SearchBar from "@/components/SearchBar";
import FilterDropdowns from "@/components/FilterDropdowns";

interface SearchFiltersWrapperProps {
  genres: Genre[];
}

export default function SearchFiltersWrapper({
  genres,
}: SearchFiltersWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { query, type, rating, genre, page, setQuery, setType, setRating, setGenre, setPage, resetFilters } =
    useSearchStore();

  // Sync URL → Zustand on mount and when URL changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlType = searchParams.get("type") || "";
    const urlRating = searchParams.get("rating") || "";
    const urlGenre = searchParams.get("genres") || "";
    const urlPage = Number(searchParams.get("page")) || 1;

    if (urlQuery !== query) setQuery(urlQuery);
    if (urlType !== type) setType(urlType);
    if (urlRating !== rating) setRating(urlRating);
    if (urlGenre !== genre) setGenre(urlGenre);
    if (urlPage !== page) setPage(urlPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Sync Zustand → URL
  const pushToUrl = useCallback(
    (updates: Partial<{ q: string; type: string; rating: string; genres: string; page: number }>) => {
      const params = new URLSearchParams(searchParams.toString());

      if ("q" in updates) updates.q ? params.set("q", updates.q) : params.delete("q");
      if ("type" in updates) updates.type ? params.set("type", updates.type) : params.delete("type");
      if ("rating" in updates) updates.rating ? params.set("rating", updates.rating) : params.delete("rating");
      if ("genres" in updates) updates.genres ? params.set("genres", updates.genres) : params.delete("genres");

      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      pushToUrl({ q: value });
    },
    [setQuery, pushToUrl]
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setType(value);
      pushToUrl({ type: value });
    },
    [setType, pushToUrl]
  );

  const handleRatingChange = useCallback(
    (value: string) => {
      setRating(value);
      pushToUrl({ rating: value });
    },
    [setRating, pushToUrl]
  );

  const handleGenreChange = useCallback(
    (value: string) => {
      setGenre(value);
      pushToUrl({ genres: value });
    },
    [setGenre, pushToUrl]
  );

  const handleReset = useCallback(() => {
    resetFilters();
    router.push("/?page=1");
  }, [resetFilters, router]);

  return (
    <div className="mb-6 space-y-4">
      <SearchBar value={query} onChange={handleQueryChange} />
      <FilterDropdowns
        type={type}
        rating={rating}
        genre={genre}
        genres={genres}
        onTypeChange={handleTypeChange}
        onRatingChange={handleRatingChange}
        onGenreChange={handleGenreChange}
        onReset={handleReset}
      />
    </div>
  );
}
