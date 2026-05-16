import { Suspense } from "react";
import { getAnimeList, getGenres } from "@/services/jikan";
import InfiniteAnimeList from "@/components/InfiniteAnimeList";
// import Pagination from "@/components/Pagination";
import SearchFiltersWrapper from "@/components/SearchFiltersWrapper";

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const limit = Number(params.limit) || 12;
  const q = typeof params.q === "string" ? params.q : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const rating = typeof params.rating === "string" ? params.rating : undefined;
  const genres = typeof params.genres === "string" ? params.genres : undefined;

  const data = await getAnimeList({ page: 1, limit, q, type, rating, genres });
  const genreData = await getGenres();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        Welcome!
      </h1>

      <Suspense fallback={null}>
        <SearchFiltersWrapper genres={genreData.data} />
        <InfiniteAnimeList
          initialData={data.data}
          initialPagination={data.pagination}
          filters={{ q, type, rating, genres, limit }}
        />
        {/* <Pagination pagination={data.pagination} /> */}
      </Suspense>
    </div>
  );
}
