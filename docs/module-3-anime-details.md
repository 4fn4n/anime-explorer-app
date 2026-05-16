# Module 3: Anime Details Page

## Overview

A dedicated page for viewing full details of a selected anime. Uses a dynamic route (`/anime/[id]`) with server-side data fetching and a client-side favorite toggle button.

---

## API Endpoint

```
GET https://api.jikan.moe/v4/anime/{id}/full
```

### Response Shape (Relevant Fields)

```typescript
interface AnimeFullResponse {
  data: {
    mal_id: number;
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    images: {
      jpg: { large_image_url: string };
    };
    trailer: {
      youtube_id: string | null;
      embed_url: string | null;
    };
    synopsis: string | null;
    background: string | null;
    type: string;
    episodes: number | null;
    status: string;
    duration: string;
    rating: string;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    genres: Genre[];
    studios: Studio[];
    aired: {
      string: string;
    };
  };
}
```

---

## Files

| File | Type | Purpose | Status |
|------|------|---------|--------|
| `src/app/anime/[id]/page.tsx` | Server Component | Fetches anime details, renders layout | ❌ Not started |
| `src/app/anime/[id]/loading.tsx` | Server Component | Skeleton loading state | ❌ Not started |
| `src/app/anime/[id]/error.tsx` | Client Component | Error boundary | ❌ Not started |
| `src/components/AnimeDetail.tsx` | Client Component | Full detail display with favorite button | ❌ Not started |
| `src/components/FavoriteButton.tsx` | Client Component | Toggle add/remove from favorites | ❌ Not started |
| `src/services/jikan.ts` | Utility | `getAnimeById(id)` function | ✅ Done |
| `src/types/anime.ts` | Types | `AnimeDetail`, `Studio` interfaces | ✅ Done |

---

## Module Status: ❌ NOT STARTED

---

## TypeScript Interfaces

```typescript
// types/anime.ts (extended)

export interface Studio {
  mal_id: number;
  name: string;
}

export interface AnimeDetail extends Anime {
  title_english: string | null;
  title_japanese: string | null;
  synopsis: string | null;
  background: string | null;
  status: string;
  duration: string;
  aired: { string: string };
  rank: number | null;
  popularity: number | null;
  scored_by: number | null;
  studios: Studio[];
  trailer: {
    youtube_id: string | null;
    embed_url: string | null;
  };
}
```

---

## Component Breakdown

### `app/anime/[id]/page.tsx` (Server Component)

**Responsibilities:**
- Extract `id` from route params
- Fetch full anime details from Jikan API
- Generate metadata (title, description) for SEO
- Pass data to client component for rendering

```typescript
// Pseudocode
export async function generateMetadata({ params }) {
  const anime = await fetchAnimeById(params.id);
  return { title: anime.title, description: anime.synopsis };
}

export default async function AnimeDetailPage({ params }) {
  const anime = await fetchAnimeById(params.id);
  return <AnimeDetail anime={anime} />;
}
```

### `components/AnimeDetail.tsx` (Client Component)

**Displays:**
- Hero section: Large image + title + score badge
- Info section: Type, episodes, status, duration, aired dates
- Synopsis section: Full text description
- Genres: Tag/chip list
- Studios: Listed with links
- Trailer: Embedded YouTube player (if available)
- Favorite button: Add/remove from watchlist

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [← Back]                    [♥ Favorite]   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  Title                        │
│  │          │  English Title                │
│  │  Image   │  Score: 8.5 ★ (12,345 users) │
│  │          │  Rank: #42 | Popularity: #15  │
│  │          │  Type: TV | Episodes: 24      │
│  └──────────┘  Status: Finished Airing      │
│                Duration: 24 min per ep      │
│                Aired: Apr 2020 - Sep 2020   │
│                                             │
├─────────────────────────────────────────────┤
│  Genres: [Action] [Adventure] [Fantasy]     │
│  Studios: [MAPPA] [Bones]                   │
├─────────────────────────────────────────────┤
│  Synopsis                                   │
│  Lorem ipsum dolor sit amet...              │
├─────────────────────────────────────────────┤
│  Trailer (YouTube Embed)                    │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │          YouTube Player             │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### `components/FavoriteButton.tsx` (Client Component)

**Behavior:**
- Reads `isFavorite(id)` from Zustand store
- Toggles `addFavorite(anime)` / `removeFavorite(id)`
- Visual feedback: filled heart when favorited, outline when not
- Shared between detail page and anime cards

---

## Responsive Layout

**Mobile (< 768px):**
- Image stacks above text content
- Full-width sections
- Trailer scales to viewport width

**Desktop (≥ 768px):**
- Image floats left, text content on right
- Two-column layout for info section
- Trailer at fixed aspect ratio

```html
<div class="flex flex-col md:flex-row gap-6">
  <div class="w-full md:w-1/3"><!-- Image --></div>
  <div class="w-full md:w-2/3"><!-- Info --></div>
</div>
```

---

## Loading State (`app/anime/[id]/loading.tsx`)

Skeleton matching the detail layout:
- Large placeholder for image
- Animated lines for title, info fields
- Block placeholder for synopsis

---

## Error State (`app/anime/[id]/error.tsx`)

**Handles:**
- 404: "Anime not found" with link back to listing
- Network error: "Failed to load" with retry button
- API rate limit: Friendly message with retry after delay

---

## Navigation

- **Back button:** Uses `router.back()` or links to `/` with preserved query params
- **Breadcrumb (optional):** Home > Anime > {Title}
