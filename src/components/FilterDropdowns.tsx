"use client";

import { Genre } from "@/types/anime";
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
  { value: "rx", label: "Rx - Hentai" },
];

interface FilterDropdownsProps {
  type: string;
  rating: string;
  genre: string;
  genres: Genre[];
  onTypeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onReset: () => void;
}

export default function FilterDropdowns({
  type,
  rating,
  genre,
  genres,
  onTypeChange,
  onRatingChange,
  onGenreChange,
  onReset,
}: FilterDropdownsProps) {
  const hasActiveFilters = type || rating || genre;

  const genreOptions = [
    { value: "", label: "All Genres" },
    ...genres.map((g) => ({ value: String(g.mal_id), label: g.name })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SelectFilter value={type} onChange={onTypeChange} options={ANIME_TYPES} />
      <SelectFilter value={rating} onChange={onRatingChange} options={ANIME_RATINGS} />
      <SelectFilter value={genre} onChange={onGenreChange} options={genreOptions} />

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
