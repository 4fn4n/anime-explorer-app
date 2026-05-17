import { create } from "zustand";
import { Anime, PaginationInfo } from "@/types/anime";
import { getAnimeList } from "@/services/jikan";

interface AnimeListState {
  anime: Anime[];
  page: number;
  hasNextPage: boolean;
  loading: boolean;
}

interface AnimeListActions {
  setInitialData: (data: Anime[], pagination: PaginationInfo) => void;
  loadMore: (filters: {
    q?: string;
    type?: string;
    rating?: string;
    genres?: string;
    limit?: number;
  }) => Promise<void>;
}

export type AnimeListStore = AnimeListState & AnimeListActions;

export const useAnimeListStore = create<AnimeListStore>()((set, get) => ({
  anime: [],
  page: 1,
  hasNextPage: false,
  loading: false,

  setInitialData: (data, pagination) =>
    set({
      anime: data,
      page: 1,
      hasNextPage: pagination.has_next_page,
    }),

  loadMore: async (filters) => {
    const { loading, hasNextPage, page } = get();
    if (loading || !hasNextPage) return;

    set({ loading: true });
    const nextPage = page + 1;

    try {
      const res = await getAnimeList({
        page: nextPage,
        limit: filters.limit || 12,
        q: filters.q,
        type: filters.type,
        rating: filters.rating,
        genres: filters.genres,
      });

      if (!Array.isArray(res?.data)) {
        set({ loading: false });
        return;
      }

      set((state) => ({
        anime: [...state.anime, ...res.data],
        page: nextPage,
        hasNextPage: res.pagination?.has_next_page ?? false,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to load more anime:", error);
      set({ loading: false });
    }
  },
}));
