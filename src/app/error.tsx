"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          Failed to load anime data. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
