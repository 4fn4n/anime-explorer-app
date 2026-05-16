# Bonus Module: Optional Enhancements

## Overview

Optional features that enhance performance, UX, and polish. These should be implemented only after Modules 1–4 are complete and stable.

---

## B.1: SSR / SSG for Performance

### Approach

Already leveraging Server Components for data fetching. Add Incremental Static Regeneration (ISR) for frequently visited pages.

```typescript
// app/anime/[id]/page.tsx
export const revalidate = 3600; // Revalidate every hour

// For popular anime, generate static pages at build time
export async function generateStaticParams() {
  const topAnime = await fetchTopAnime();
  return topAnime.map((anime) => ({ id: String(anime.mal_id) }));
}
```

### Benefits
- Faster page loads for popular anime
- Reduced API calls to Jikan
- Better SEO with pre-rendered HTML

---

## B.2: React Query / SWR for Caching

### Setup

```bash
npm install @tanstack/react-query
```

### Implementation

```typescript
// providers/QueryProvider.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Usage (Client-side fetching)

```typescript
// For genre list or client-side refetching
const { data, isLoading, error } = useQuery({
  queryKey: ["genres"],
  queryFn: fetchGenres,
});
```

### Benefits
- Automatic caching and deduplication
- Background refetching for stale data
- Optimistic updates for favorites
- Built-in loading/error states

---

## B.3: Infinite Scrolling

### Approach

Replace traditional pagination with `IntersectionObserver`-based infinite scroll.

### Implementation

```typescript
// components/InfiniteAnimeList.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

export function InfiniteAnimeList() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["anime", filters],
    queryFn: ({ pageParam = 1 }) => fetchAnimeList({ page: pageParam, ...filters }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  return (
    <>
      <AnimeGrid anime={data.pages.flatMap((p) => p.data)} />
      <div ref={ref}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </>
  );
}
```

### Considerations
- Add "Back to top" button
- Preserve scroll position on navigation back
- Show total results count
- Rate limit awareness (throttle page fetches)

---

## B.4: Dark Mode Toggle

### Setup

```typescript
// tailwind.config.ts
export default {
  darkMode: "class",
  // ...
};
```

### Zustand Store

```typescript
// store/themeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    { name: "theme-preference" }
  )
);
```

### Theme Provider

```typescript
// components/ThemeProvider.tsx
"use client";

export function ThemeProvider({ children }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
```

### Toggle Component

```typescript
// components/ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
```

### Color Tokens

```css
/* Use Tailwind dark: variants throughout */
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

---

## B.5: Framer Motion Animations

### Setup

```bash
npm install framer-motion
```

### Page Transitions

```typescript
// components/PageTransition.tsx
"use client";
import { motion } from "framer-motion";

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Card Stagger Animation

```typescript
// components/AnimeGrid.tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.div variants={container} initial="hidden" animate="show">
  {anime.map((a) => (
    <motion.div key={a.mal_id} variants={item}>
      <AnimeCard anime={a} />
    </motion.div>
  ))}
</motion.div>
```

### Card Hover Effects

```typescript
<motion.div
  whileHover={{ scale: 1.03, y: -4 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <AnimeCard />
</motion.div>
```

### Favorite Button Animation

```typescript
<motion.button
  whileTap={{ scale: 0.8 }}
  animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
>
  <HeartIcon filled={isFavorite} />
</motion.button>
```

---

## B.6: Request Cancellation (AbortController)

### Implementation

```typescript
// lib/fetchWithCancel.ts
let controller: AbortController | null = null;

export async function fetchWithCancel(url: string) {
  // Cancel previous request
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      // Request was cancelled — ignore
      return null;
    }
    throw error;
  }
}
```

### Integration with Search

```typescript
// In SearchBar component
useEffect(() => {
  const timer = setTimeout(async () => {
    const result = await fetchWithCancel(
      `https://api.jikan.moe/v4/anime?q=${debouncedQuery}`
    );
    if (result) setResults(result.data);
  }, 300);

  return () => clearTimeout(timer);
}, [debouncedQuery]);
```

### Benefits
- Prevents race conditions from out-of-order responses
- Reduces unnecessary network traffic
- Improves responsiveness during rapid typing

---

## Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | Dark Mode (B.4) | Low | High (UX) |
| 2 | Request Cancellation (B.6) | Low | Medium (stability) |
| 3 | SSR/ISR (B.1) | Low | Medium (performance) |
| 4 | React Query (B.2) | Medium | High (DX + UX) |
| 5 | Framer Motion (B.5) | Medium | High (polish) |
| 6 | Infinite Scroll (B.3) | Medium | Medium (UX) |
