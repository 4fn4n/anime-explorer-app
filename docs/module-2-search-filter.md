# Module 2: Search & Filter Feature

## Overview

Adds search and filter capabilities to the anime listing. Users can search by title and filter by type, genre, and rating. State is managed via URL search params (single source of truth), read and updated through `useSearchParams()` and `router.push()` in `SearchFiltersWrapper`.

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
| `src/components/SearchBar.tsx` | Client Component | Text input with debounce (300ms) and race-condition prevention | ✅ Done |
| `src/components/FilterDropdowns.tsx` | Client Component | Type, genre, rating dropdowns using `SelectFilter` | ✅ Done |
| `src/components/SelectFilter.tsx` | Client Component | Reusable select dropdown with custom chevron icon | ✅ Done |
| `src/components/SearchFiltersWrapper.tsx` | Client Component | Orchestrates search + filters, updates URL params | ✅ Done |
| `src/services/jikan.ts` | Utility | Extended with `getGenres()` + filter params | ✅ Done |
| `src/types/anime.ts` | Types | Added `GenreListResponse` | ✅ Done |

**Note:** Zustand store (`src/store/searchStore.ts`) was not needed — URL search params serve as the single source of truth, read via `useSearchParams()` in `SearchFiltersWrapper`.

---

## Module Status: ✅ COMPLETE

---

## Component Breakdown

### `components/SearchBar.tsx` (Client Component)

**Behavior:**
- Controlled input with local state + debounce (300ms)
- Uses `pendingRef` to prevent race conditions (external value sync doesn't override pending local edits)
- Resets page to 1 on new search
- Clear button immediately fires `onChange("")`

**Implementation Notes:**
```typescript
"use client";

// Local state tracks input value
// pendingRef prevents external value from overwriting user's in-progress edits
// Debounce via useEffect + setTimeout (300ms)
// Clear button calls both setInput("") and onChange("") immediately
```

### `components/SelectFilter.tsx` (Client Component)

**Behavior:**
- Reusable select component with `appearance-none` and custom `ChevronDownIcon`
- Accepts `value`, `onChange`, and `options` props
- Truncates overflow text with ellipsis
- Consistent focus ring styling (blue)

### `components/FilterDropdowns.tsx` (Client Component)

**Dropdowns:**
1. **Type** — Static list: TV, Movie, OVA, Special, ONA, Music
2. **Rating** — Static list: G, PG, PG-13, R-17+, R+, Rx
3. **Genre** — Fetched from `/genres/anime` (passed as prop from server component)

**Behavior:**
- Each dropdown uses `SelectFilter` component
- "Clear All" button resets all filters (visible only when filters are active)

### `components/SearchFiltersWrapper.tsx` (Client Component)

**Responsibilities:**
- Renders SearchBar + FilterDropdowns
- Reads current filter values from URL via `useSearchParams()`
- `updateParam(key, value)` — sets or deletes a single URL param and navigates
- `handleReset()` — navigates to `/?page=1` to clear all filters
- Uses `useCallback` for stable function references (prevents SearchBar debounce reset)

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

| Field | URL Param | Example |
|-------|-----------|---------|
| Search query | `q` | `?q=naruto` |
| Type filter | `type` | `?type=tv` |
| Genre filter | `genres` | `?genres=1` |
| Rating filter | `rating` | `?rating=pg13` |
| Page number | `page` | `?page=2` |

Combined: `/?q=naruto&type=tv&genres=1&rating=pg13&page=1`

---

## Debounce Implementation

```typescript
// SearchBar uses local state + pendingRef to debounce and prevent race conditions
const [input, setInput] = useState(value);
const pendingRef = useRef(false);

// Skip external sync while user is typing
useEffect(() => {
  if (!pendingRef.current) setInput(value);
}, [value]);

// Debounce: only fire onChange after 300ms of inactivity
useEffect(() => {
  if (input === value) { pendingRef.current = false; return; }
  pendingRef.current = true;
  const timer = setTimeout(() => {
    pendingRef.current = false;
    onChange(input);
  }, 300);
  return () => clearTimeout(timer);
}, [input, value, onChange]);
```

---

## Responsive Design

- Search bar: Full width on mobile, constrained on desktop
- Filters: Stack vertically on mobile, horizontal row on desktop (`flex-wrap`)
- Select dropdowns: Fixed width with text truncation for overflow

```html
<div class="flex flex-col md:flex-row gap-3">
  <SearchBar />
  <FilterDropdowns />
</div>
```
