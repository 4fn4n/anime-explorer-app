# Anime Explorer

A responsive anime browsing application built with Next.js 15, featuring search, filtering, favorites, and dark mode. Data is fetched from the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API).

## Features

- Browse anime with infinite scroll (IntersectionObserver)
- Search by title with debounced input (500ms)
- Filter by type, rating, and genre
- Anime detail pages with synopsis, trailer, and metadata
- Favorites system persisted to localStorage
- Dark/light mode toggle
- Staggered card animations (Framer Motion)
- Mobile burger menu navigation
- `cn` utility (clsx + tailwind-merge) for class merging
- Fully responsive (mobile → desktop)

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (search, favorites, theme stores)
- **Animations:** Framer Motion
- **Utilities:** clsx + tailwind-merge (`cn`)
- **Icons:** Heroicons v2
- **Package Manager:** pnpm

## Setup & Run

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
git clone <repo-url>
cd anime-explorer-app
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```env
JIKAN_API_URL=https://api.jikan.moe/v4
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & Production

```bash
pnpm build
pnpm start
```

## Architecture

### Rendering Strategy

- **Server Components** (`page.tsx`) handle data fetching — no client-side waterfalls
- **Client Components** handle interactivity (search input, filters, favorites toggle)
- **ISR** (Incremental Static Regeneration) on anime detail pages (1-hour revalidation)
- API calls proxied through `/api/jikan` route to hide external URLs

### State Management (Zustand)

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `searchStore` | Search query, filters, pagination | Synced with URL params |
| `animeListStore` | Anime list, page, loading, loadMore | In-memory (seeded from server) |
| `favoritesStore` | Saved anime list | localStorage |
| `themeStore` | Dark/light mode preference | localStorage |

All stores use typed interfaces for state and actions. Components access stores directly via hooks — no prop drilling.

### Component Separation

```
src/
├── app/                    # Routes & layouts (Server Components)
│   ├── page.tsx            # Home (anime listing)
│   ├── favorites/page.tsx  # Favorites page
│   └── anime/[id]/page.tsx # Anime detail page
├── components/             # Reusable UI (Client Components)
│   ├── AnimeCard.tsx       # Grid card with hover favorite
│   ├── AnimeGrid.tsx       # Animated grid wrapper
│   ├── InfiniteAnimeList.tsx # Infinite scroll container
│   ├── SearchBar.tsx       # Debounced search (reads store directly)
│   ├── SearchFiltersWrapper.tsx # URL ↔ store sync
│   ├── FilterDropdowns.tsx # Type/rating/genre filters (reads store directly)
│   ├── SelectFilter.tsx    # Reusable select with cn()
│   ├── Pagination.tsx      # Page navigation (legacy)
│   ├── FavoriteButton.tsx  # Toggle favorite (detail page)
│   ├── Navbar.tsx          # Navigation + burger menu + theme toggle
│   └── ThemeProvider.tsx   # Dark mode context
├── store/                  # Zustand stores
├── services/               # API fetch helpers
├── lib/                    # Utilities (cn)
└── types/                  # TypeScript interfaces
```

### Responsiveness

- **Mobile (< 640px):** Single column grid, 2×2 filter grid, burger menu
- **Tablet (640–1024px):** 2-column grid
- **Desktop (> 1024px):** 4-column grid, inline filters
- Filters use `grid-cols-2` on mobile, `flex` on desktop
- Dark mode supported across all breakpoints

### API Integration

All requests go through `src/app/api/jikan/route.ts` (server-side proxy):
- Hides external API URL from client
- Allows server-side caching (`revalidate`)

## Deployment

Deploy on [Vercel](https://vercel.com) — auto-detects Next.js. Set environment variables in the Vercel dashboard.
