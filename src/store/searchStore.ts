import { create } from "zustand";

interface SearchState {
  query: string;
  type: string;
  genre: string;
  rating: string;
  page: number;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setType: (type: string) => void;
  setGenre: (genre: string) => void;
  setRating: (rating: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  query: "",
  type: "",
  genre: "",
  rating: "",
  page: 1,
};

export const useSearchStore = create<SearchStore>()((set) => ({
  ...initialState,
  setQuery: (query) => set({ query, page: 1 }),
  setType: (type) => set({ type, page: 1 }),
  setGenre: (genre) => set({ genre, page: 1 }),
  setRating: (rating) => set({ rating, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set(initialState),
}));
