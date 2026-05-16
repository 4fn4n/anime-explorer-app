# Module 4: Favorites / Watchlist + State Management

## Overview

Implements a favorites/watchlist system using Zustand with persist middleware (localStorage). Users can save anime to a personal list that persists across sessions. This module also covers the overall state management architecture.

---

## Files

| File | Type | Purpose |
|------|------|---------|
| `store/favoritesStore.ts` | Zustand Store | Favorites state with persist middleware |
| `store/searchStore.ts` | Zustand Store | Search and filter global state |
| `store/types.ts` | Types | Store type definitions |
| `app/favorites/page.tsx` | Client Component | Favorites listing page |
| `components/FavoriteButton.tsx` | Client Component | Toggle button (shared) |
| `components/EmptyState.tsx` | Client Component | "No favorites" placeholder |

---

## Zustand Store: Favorites

```typescript
// store/favoritesStore.ts
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

      isFavorite: (id) =>
        get().favorites.some((a) => a.mal_id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "anime-favorites",
    }
  )
);
```

---

## Zustand Store: Search & Filters

```typescript
// store/searchStore.ts
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
```

---

## Favorites Page

### `app/favorites/page.tsx` (Client Component)

```typescript
"use client";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  // Hydration guard
  useEffect(() => setMounted(true), []);

  if (!mounted) return <FavoritesSkeleton />;
  if (favorites.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {favorites.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  );
}
```

---

## Hydration Handling

Since Zustand persist uses localStorage (client-only), Server Components can't access this state. Solution:

```typescript
// Pattern: Mount guard to prevent hydration mismatch

const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  setHydrated(true);
}, []);

// Render skeleton/placeholder until hydrated
if (!hydrated) return <Skeleton />;
```

Alternative using Zustand's `onRehydrateStorage`:
```typescript
persist(
  // ...store config
  {
    name: "anime-favorites",
    onRehydrateStorage: () => (state) => {
      state?.setHydrated(true);
    },
  }
)
```

---

## State Management Architecture

### Store Organization

```
store/
├── favoritesStore.ts    # Persisted to localStorage
├── searchStore.ts       # Ephemeral (URL is source of truth)
└── types.ts             # Shared type definitions
```

### Design Principles

1. **Single responsibility** — Each store manages one domain
2. **No prop drilling** — Components access stores directly via hooks
3. **URL as source of truth** — Search/filter state syncs with URL params
4. **localStorage persistence** — Only for favorites (user data that must survive refresh)
5. **TypeScript throughout** — All state and actions are fully typed

### When to Use Each Store

| Data | Store | Persistence |
|------|-------|-------------|
| Favorites list | `favoritesStore` | localStorage |
| Search query | `searchStore` | URL params |
| Filter selections | `searchStore` | URL params |
| Current page | `searchStore` | URL params |

---

## Favorites Page Features

- **Grid display** matching listing page layout
- **Remove button** on each card
- **Clear all** button with confirmation
- **Empty state** with illustration and CTA to browse anime
- **Responsive** — same grid breakpoints as listing page

---

## Empty State Component

```typescript
// components/EmptyState.tsx
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <HeartIcon className="w-16 h-16 text-gray-300" />
      <h2 className="mt-4 text-xl font-semibold">No favorites yet</h2>
      <p className="mt-2 text-gray-500">
        Start browsing and add anime to your watchlist
      </p>
      <Link href="/" className="mt-4 btn-primary">
        Browse Anime
      </Link>
    </div>
  );
}
```

---

## Data Flow: Adding a Favorite

```
User clicks ♥ button
       │
       ▼
FavoriteButton calls addFavorite(anime)
       │
       ▼
Zustand updates state → persist middleware writes to localStorage
       │
       ▼
All subscribed components re-render (button fills, count updates)
       │
       ▼
On page refresh → persist middleware rehydrates from localStorage
```
