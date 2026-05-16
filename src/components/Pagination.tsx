"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PaginationInfo } from "@/types/anime";

interface PaginationProps {
  pagination: PaginationInfo;
}

export default function Pagination({ pagination }: PaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = pagination.current_page;
  const lastPage = pagination.last_visible_page;

  function buildPageUrl(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    page ? params.set("limit", String(page)):params.set("limit", String(1));
    return `/?${params.toString()}`;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Link
        href={buildPageUrl(currentPage - 1)}
        className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 ${
          currentPage <= 1
            ? "pointer-events-none opacity-50"
            : ""
        }`}
        aria-disabled={currentPage <= 1}
      >
        Previous
      </Link>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {lastPage}
      </span>

      <Link
        href={buildPageUrl(currentPage + 1)}
        className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 ${
          !pagination.has_next_page
            ? "pointer-events-none opacity-50"
            : ""
        }`}
        aria-disabled={!pagination.has_next_page}
      >
        Next
      </Link>
    </div>
  );
}
