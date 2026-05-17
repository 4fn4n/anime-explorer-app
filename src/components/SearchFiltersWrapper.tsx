"use client";

import { useEffect, useRef } from "react";
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

  const { query, type, rating, genre, setQuery, setType, setRating, setGenre, setPage } =
    useSearchStore();

  const isInitialSync = useRef(true);

  // URL → Store: sync URL params into store on mount / back-forward navigation
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
    if (urlPage !== 1) setPage(urlPage);

    isInitialSync.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Store → URL: push store changes to URL
  useEffect(() => {
    if (isInitialSync.current) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (rating) params.set("rating", rating);
    if (genre) params.set("genres", genre);

    router.push(`/?${params.toString()}`);
  }, [query, type, rating, genre, router]);

  return (
    <div className="mb-6 space-y-4">
      <SearchBar />
      <FilterDropdowns genres={genres} />
    </div>
  );
}
