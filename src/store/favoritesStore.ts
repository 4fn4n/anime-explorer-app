import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Anime } from "@/types/anime";

interface FavoritesState {
  favorites: Anime[];
}

interface FavoritesActions {
  addFavorite: (anime: Anime) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (anime) =>
        set((state) => ({
          favorites: [...state.favorites, anime],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((a) => a.mal_id !== id),
        })),

      isFavorite: (id) => get().favorites.some((a) => a.mal_id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "anime-favorites",
    }
  )
);
