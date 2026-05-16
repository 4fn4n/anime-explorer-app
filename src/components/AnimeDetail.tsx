"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, StarIcon } from "@heroicons/react/24/solid";
import { AnimeDetail as AnimeDetailType } from "@/types/anime";
import FavoriteButton from "@/components/FavoriteButton";

interface AnimeDetailProps {
  animeDetailType: AnimeDetailType;
}

export default function AnimeDetail({ animeDetailType }: AnimeDetailProps) {
  const imageUrl =
    animeDetailType.images?.jpg?.large_image_url ||
    animeDetailType.images?.jpg?.image_url ||
    "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>
        <FavoriteButton anime={animeDetailType} />
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-1/3">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={animeDetailType.title || "Anime Title"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-2/3">
        {animeDetailType.title && (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {animeDetailType.title}
          </h1>
        )}
          {animeDetailType.title_english && (
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              {animeDetailType.title_english}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {animeDetailType.score && (
              <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-white">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                {animeDetailType.score.toFixed(1)}
                {animeDetailType.scored_by && (
                  <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({animeDetailType.scored_by.toLocaleString()} users)
                  </span>
                )}
              </div>
            )}
            {animeDetailType.rank && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Rank #{animeDetailType.rank}
              </span>
            )}
            {animeDetailType.popularity && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Popularity #{animeDetailType.popularity}
              </span>
            )}
          </div>

          {animeDetailType.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {animeDetailType.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {animeDetailType.type && (
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Type</span>
                <p className="text-gray-900 dark:text-white">{animeDetailType.type}</p>
              </div>
            )}
            {animeDetailType.episodes && (
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Episodes</span>
                <p className="text-gray-900 dark:text-white">{animeDetailType.episodes}</p>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Status</span>
              <p className="text-gray-900 dark:text-white">{animeDetailType.status}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500 dark:text-gray-400">Duration</span>
              <p className="text-gray-900 dark:text-white">{animeDetailType.duration}</p>
            </div>
            {animeDetailType.aired?.string && (
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Aired</span>
                <p className="text-gray-900 dark:text-white">{animeDetailType.aired.string}</p>
              </div>
            )}
            {animeDetailType.rating && (
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Rating</span>
                <p className="text-gray-900 dark:text-white">{animeDetailType.rating}</p>
              </div>
            )}
          </div>

          {animeDetailType.studios.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Studios</span>
              <p className="text-sm text-gray-900 dark:text-white">
                {animeDetailType.studios.map((x) => x.name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {animeDetailType.synopsis && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Synopsis</h2>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {animeDetailType.synopsis}
          </p>
        </div>
      )}

      {animeDetailType.trailer?.embed_url && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Trailer</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={animeDetailType.trailer.embed_url}
              title={`${animeDetailType.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
