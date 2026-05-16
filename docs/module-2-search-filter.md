# Module 2: Search & Filter Feature

## Overview

Adds search and filter capabilities to the anime listing. Users can search by title and filter by type, genre, and rating. State is managed globally via Zustand and synced with URL query parameters.

---

## API Endpoints

### Search + Filter
```
GET https://api.jikan.moe/v4/anime?q={query}&type={type}&rating={rating}&genres={genre_id}&page={page}&limit={limit}
```

### Genre List (for dropdown)
```
GET https://api.jikan.moe/v4/genres/anime
```

### Filter Parameter Values

| Parameter | Values |
|-----------|--------|
| `type` | `tv`, `movie`, `ova`, `special`, `ona`, `music` |
| `rating` | `g`, `pg`, `pg13`, `r17`, `r`, `rx` |
| `genres` | Numeric IDs from genre endpoint (e.g., `1` = Action) |

---

## Files

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `src/components/SearchBar.tsx` | Client Component | Text input with debounce | ❌ Not started |
| `src/components/FilterDropdowns.tsx` | Client Component | Type, genre, rating dropdowns | ❌ Not started |
| `src/components/SearchFiltersWrapper.tsx` | Client Component | Orchestrates search + filters, syncs URL | ❌ Not started |
| `src/store/searchStore.ts` | Zustand Store | Global state for query, type, genre, rating | ❌ Not started |
| `src/services/jikan.ts` | Utility | Extended with filter params support | ⚠️ Partially done (`FetchAnimeListParams` already supports q, type, rating, genres) |

---

## Module Status: ❌ NOT STARTED

---

## Zustand Store Definition

```typescript
// store/searchStore.ts

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
```

---

## Component Breakdown

### `components/SearchBar.tsx` (Client Component)

**Behavior:**
- Controlled input connected to Zustand `query` state
- Debounced (300ms) before triggering URL update
- Resets page to 1 on new search
- Clear button to reset search

**Implementation Notes:**
```typescript
"use client";

// Uses useEffect + setTimeout for debounce
// Updates URL searchParams via useRouter().push()
// Syncs initial value from URL on mount
```

### `components/FilterDropdowns.tsx` (Client Component)

**Dropdowns:**
1. **Type** — Static list: TV, Movie, OVA, Special, ONA, Music
2. **Rating** — Static list: G, PG, PG-13, R-17+, R+, Rx
3. **Genre** — Fetched from `/genres/anime` on mount (cached)

**Behavior:**
- Each dropdown updates corresponding Zustand state
- Resets page to 1 when filter changes
- "Clear All" button resets all filters

### `components/SearchFiltersWrapper.tsx` (Client Component)

**Responsibilities:**
- Renders SearchBar + FilterDropdowns
- Handles URL ↔ Zustand synchronization
- On mount: reads URL params → populates Zustand
- On state change: updates URL params → triggers server re-render

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     User Interaction                      │
│         (types in search / selects filter)               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Zustand Store                           │
│         (query, type, genre, rating, page)               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                URL Query Params Update                    │
│     router.push(`/?q=naruto&type=tv&page=1`)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│          Server Component Re-renders                     │
│     (reads new searchParams, fetches from API)          │
└─────────────────────────────────────────────────────────┘
```

---

## URL Parameter Mapping

| Zustand Field | URL Param | Example |
|---------------|-----------|---------|
| `query` | `q` | `?q=naruto` |
| `type` | `type` | `?type=tv` |
| `genre` | `genres` | `?genres=1` |
| `rating` | `rating` | `?rating=pg13` |
| `page` | `page` | `?page=2` |

Combined: `/?q=naruto&type=tv&genres=1&rating=pg13&page=1`

---

## Debounce Implementation

```typescript
// Debounce search input to avoid API spam
const [localQuery, setLocalQuery] = useState(query);

useEffect(() => {
  const timer = setTimeout(() => {
    setQuery(localQuery);
  }, 300);
  return () => clearTimeout(timer);
}, [localQuery]);
```

---

## Optional: Request Cancellation

```typescript
// Using AbortController to cancel in-flight requests
const controllerRef = useRef<AbortController | null>(null);

const fetchWithCancel = async (params: SearchParams) => {
  controllerRef.current?.abort();
  controllerRef.current = new AbortController();

  const response = await fetch(buildUrl(params), {
    signal: controllerRef.current.signal,
  });
  // ...
};
```

---

## Responsive Design

- Search bar: Full width on mobile, constrained on desktop
- Filters: Stack vertically on mobile, horizontal row on desktop
- Use `flex-wrap` or grid layout for filter section

```html
<div class="flex flex-col md:flex-row gap-3">
  <SearchBar />
  <FilterDropdowns />
</div>
```
