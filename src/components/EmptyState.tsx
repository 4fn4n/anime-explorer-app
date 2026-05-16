import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <HeartIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
        No favorites yet
      </h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Start browsing and add anime to your watchlist
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Browse Anime
      </Link>
    </div>
  );
}
