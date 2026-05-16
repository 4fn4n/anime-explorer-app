"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Genre } from "@/types/anime";
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

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const rating = searchParams.get("rating") || "";
  const genre = searchParams.get("genres") || "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(key, value) : params.delete(key);
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleQueryChange = useCallback(
    (value: string) => updateParam("q", value),
    [updateParam]
  );

  const handleTypeChange = useCallback(
    (value: string) => updateParam("type", value),
    [updateParam]
  );

  const handleRatingChange = useCallback(
    (value: string) => updateParam("rating", value),
    [updateParam]
  );

  const handleGenreChange = useCallback(
    (value: string) => updateParam("genres", value),
    [updateParam]
  );

  const handleReset = useCallback(() => {
    router.push("/?page=1");
  }, [router]);

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
