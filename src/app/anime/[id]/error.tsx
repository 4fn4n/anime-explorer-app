"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AnimeDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Anime detail error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Failed to load anime details
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Something went wrong while fetching the data.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back to Browse
        </Link>
      </div>
    </div>
  );
}
