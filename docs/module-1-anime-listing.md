# Module 1: Anime Listing Page

## Overview

The core page of the application that displays a paginated grid of anime fetched from the Jikan API. Uses Server Components for data fetching and Client Components for interactivity.

---

## API Endpoint

Proxied through Next.js API route to hide the external URL:

```
# Internal proxy route
GET /api/jikan?path=/anime&page={page}&limit={limit}

# Proxies to (server-only, via JIKAN_API_URL env var)
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

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `src/app/page.tsx` | Server Component | Reads `searchParams`, fetches anime list, renders grid | ✅ Done |
| `src/app/layout.tsx` | Server Component | Root layout with Navbar, fonts, global styles | ✅ Done |
| `src/app/loading.tsx` | Server Component | Skeleton loading UI during data fetch | ✅ Done |
| `src/app/error.tsx` | Client Component | Error boundary for failed fetches | ✅ Done |
| `src/app/not-found.tsx` | Server Component | Custom 404 page | ✅ Done |
| `src/app/globals.css` | CSS | `@import "tailwindcss"` (TailwindCSS v4) | ✅ Done |
| `src/app/api/jikan/route.ts` | API Route | Proxy to Jikan API, hides external URL | ✅ Done |
| `src/components/AnimeCard.tsx` | Client Component | Displays anime title, image, type, score | ✅ Done |
| `src/components/AnimeGrid.tsx` | Client Component | Responsive grid wrapper | ✅ Done |
| `src/components/Pagination.tsx` | Client Component | Page navigation with URL params | ✅ Done |
| `src/components/Navbar.tsx` | Client Component | Sticky nav with logo, Browse/Favorites links | ✅ Done |
| `src/services/jikan.ts` | Utility | API fetch helpers (`getAnimeList`, `getAnimeById`) | ✅ Done |
| `src/types/anime.ts` | Types | TypeScript interfaces for API responses | ✅ Done |
| `src/types/css.d.ts` | Types | CSS module type declarations (needed for Next.js 15) | ✅ Done |
| `.env` / `.env.example` | Config | `JIKAN_API_URL` (server-only) + `NEXT_PUBLIC_SITE_URL` | ✅ Done |
| `next.config.ts` | Config | Image remote patterns (`hostname: "**"`) | ✅ Done |

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
- Read `searchParams` (Promise in Next.js 15) for `page` and `limit`
- Call Jikan API server-side via `getAnimeList()`
- Pass data to `AnimeGrid` and `Pagination`
- Wrap client components in `<Suspense>` (required for `useSearchParams()` in Pagination)

```typescript
// Actual implementation
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams; // Promise in Next.js 15
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const data = await getAnimeList({ page, limit });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1>Anime Explorer</h1>
      <Suspense fallback={null}>
        <AnimeGrid anime={data.data} />
        <Pagination pagination={data.pagination} />
      </Suspense>
    </div>
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

---

## Tech Stack (as implemented)

- **Next.js**: 15.5.18 (App Router)
- **React**: 19.x
- **TypeScript**: Strict mode, path alias `@/*` → `./src/*`
- **TailwindCSS**: v4 (`@import "tailwindcss"` syntax)
- **Icons**: `@heroicons/react` v2 (StarIcon, FilmIcon)
- **Package Manager**: pnpm
- **Rendering**: SSR (due to `searchParams` usage)

---

## Module Status: ✅ COMPLETE
