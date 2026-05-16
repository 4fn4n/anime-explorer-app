# Module 1: Anime Listing Page

## Overview

The core page of the application that displays a paginated grid of anime fetched from the Jikan API. Uses Server Components for data fetching and Client Components for interactivity.

---

## API Endpoint

```
GET https://api.jikan.moe/v4/anime?page={page}&limit={limit}
```

### Response Shape

```typescript
interface AnimeListResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}
```

---

## Files

| File | Type | Purpose |
|------|------|---------|
| `app/page.tsx` | Server Component | Reads `searchParams`, fetches anime list, renders grid |
| `app/loading.tsx` | Server Component | Skeleton loading UI during data fetch |
| `app/error.tsx` | Client Component | Error boundary for failed fetches |
| `components/AnimeCard.tsx` | Client Component | Displays anime title, image, type, score |
| `components/AnimeGrid.tsx` | Client Component | Responsive grid wrapper |
| `components/Pagination.tsx` | Client Component | Page navigation controls |
| `lib/jikan.ts` | Utility | API fetch helper functions |
| `types/anime.ts` | Types | TypeScript interfaces for API responses |

---

## TypeScript Interfaces

```typescript
// types/anime.ts

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  type: string;
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  rating: string | null;
  genres: Genre[];
}

export interface Genre {
  mal_id: number;
  name: string;
}

export interface PaginationInfo {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: PaginationInfo;
}
```

---

## Component Breakdown

### `app/page.tsx` (Server Component)

**Responsibilities:**
- Read `searchParams` for `page` and `limit`
- Call Jikan API server-side
- Pass data to `AnimeGrid` and `Pagination`

```typescript
// Pseudocode
export default async function HomePage({ searchParams }) {
  const page = searchParams.page || 1;
  const limit = searchParams.limit || 10;
  const data = await fetchAnimeList({ page, limit });

  return (
    <main>
      <AnimeGrid anime={data.data} />
      <Pagination pagination={data.pagination} />
    </main>
  );
}
```

### `components/AnimeCard.tsx` (Client Component)

**Displays:**
- Anime poster image
- Title (truncated if long)
- Type badge (TV, Movie, OVA)
- Score with star icon

**Interactions:**
- Click navigates to `/anime/[id]`
- Favorite button (wired in Module 4)

### `components/Pagination.tsx` (Client Component)

**Behavior:**
- Shows current page and total pages
- Previous/Next buttons
- Updates URL query params (`?page=2`)
- Disables Previous on page 1, Next on last page

---

## Responsive Layout

```
Mobile (< 640px):    1 column grid
Tablet (640-1024px): 2 column grid
Desktop (> 1024px):  4 column grid
```

TailwindCSS classes:
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## Loading State (`app/loading.tsx`)

Displays a skeleton grid matching the layout:
- Placeholder cards with animated pulse
- Same grid dimensions as actual content

---

## Error State (`app/error.tsx`)

- Displays user-friendly error message
- "Retry" button to attempt refetch
- Logs error details to console in development

---

## Rate Limiting Consideration

Jikan API has rate limits (3 requests/second for unauthenticated). The server component approach naturally throttles since fetches happen on the server during navigation, not on every client interaction.
