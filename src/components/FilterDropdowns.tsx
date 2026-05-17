"use client";

import { Genre } from "@/types/anime";
import { useSearchStore } from "@/store/searchStore";
import SelectFilter from "@/components/SelectFilter";

const ANIME_TYPES = [
  { value: "", label: "All Types" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "special", label: "Special" },
  { value: "ona", label: "ONA" },
  { value: "music", label: "Music" },
];

const ANIME_RATINGS = [
  { value: "", label: "All Ratings" },
  { value: "g", label: "G - All Ages" },
  { value: "pg", label: "PG - Children" },
  { value: "pg13", label: "PG-13 - Teens 13+" },
  { value: "r17", label: "R - 17+" },
  { value: "r", label: "R+ - Mild Nudity" },
];

interface FilterDropdownsProps {
  genres: Genre[];
}

export default function FilterDropdowns({ genres }: FilterDropdownsProps) {
  const { type, rating, genre, setType, setRating, setGenre, resetFilters } =
    useSearchStore();
  const hasActiveFilters = type || rating || genre;

  const genreOptions = [
    { value: "", label: "All Genres" },
    ...genres.map((g) => ({ value: String(g.mal_id), label: g.name })),
  ];

  return (
    <div className="grid grid-cols-2 justify-items-center gap-3 sm:flex sm:flex-wrap sm:items-center">
      <SelectFilter value={type} onChange={setType} options={ANIME_TYPES} className="w-full sm:w-30" />
      <SelectFilter value={rating} onChange={setRating} options={ANIME_RATINGS} className="w-full sm:w-30" />
      <SelectFilter value={genre} onChange={setGenre} options={genreOptions} className="w-full sm:w-30" />

      {/* {hasActiveFilters && ( */}
        <button
          onClick={resetFilters}
          className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:w-30"
        >
          Clear All
        </button>
      {/* )} */}
    </div>
  );
}
