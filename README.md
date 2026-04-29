# Tele Iva

A TV listings dashboard styled like a vintage 1960s European magazine. Built on the
[TVMaze](https://www.tvmaze.com/api) public API, it groups shows by genre, sorts each
group by rating, and routes through to a detailed view per show.

This is a Vue application, has a clean and reusable code, uses responsive
layouts, a search feature, and unit tests. The visual identity (warm paper palette,
Abril Fatface display serif, numbered genre sections, color blocks, film-grain
texture) is a deliberate departure from generic dashboards — the goal was for the
result to feel handmade rather than templated.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) | Brief required Vue. Composition API gives clean composable extraction and TS inference. |
| Bundler | Vite | Fast dev start, minimal config, native ES module HMR. |
| Language | TypeScript (strict) | API responses, store contracts, and prop types are checked at the boundary. |
| Routing | Vue Router | Built-in lazy route loading, named routes, typed `meta`. |
| UI state | Pinia | One store: theme. Only state that genuinely crosses components. |
| Server state | TanStack Vue Query | Cache, retry, `AbortSignal` cancellation, request dedupe — none of which I'd want to write by hand. |
| Component primitives | Naive UI | `NCard`, `NButton`, `NTag`, `NIcon`, `NConfigProvider`. Themed via overrides driven from CSS tokens. |
| Search | Fuse.js | Fuzzy in-memory search over the cached show list (no extra API call). |
| Tests | Vitest + Vue Test Utils | First-party Vite integration. |

Server state lives in Vue Query. Pinia is reserved for cross-component UI state only —
fetched data never lands there. This is a common antipattern I avoided deliberately.

## Architectural choices worth calling out

- **Design tokens drive everything.** All colors, type scale, spacing, radii, motion
  durations live in `src/style/tokens.css` as CSS custom properties. Light/dark themes
  are two blocks under `[data-theme="light"]` / `[data-theme="dark"]`; switching the
  attribute on `<html>` flips every styled component instantly. The Naive UI override
  object in `src/style/naive-theme.ts` mirrors these as concrete hex values..
- **No FOUC.** An inline `<script>` in `index.html` reads stored theme + system
  preference and sets `data-theme` before paint. A bootstrap loading screen renders
  inside `#app` from raw HTML so users see something the moment HTML is parsed,
  before the JS bundle even downloads. Vue replaces it on mount.
- **Network warming.** `<link rel="preconnect">` to `api.tvmaze.com` and
  `static.tvmaze.com` so DNS, TCP, and TLS run in parallel with the bundle download.
- **Routes are lazy.** Each view is a dynamic import; only the dashboard chunk loads
  on first paint.
- **`AbortSignal` threaded end-to-end.** API client accepts `signal`, Vue Query
  passes it from `queryFn`. Navigating away from a view cancels in-flight requests.
- **Accessibility is non-negotiable.** Semantic landmarks (`<main>`, `<nav>`,
  `<article>`, `<section>`), explicit `role="list"` on horizontal lists (defends
  against the VoiceOver `list-style: none` bug), `aria-labelledby` on genre sections,
  named `aria-label` on social/icon buttons, focus-visible 3px gold outlines, arrow-key
  navigation between cards in horizontal lists, and `prefers-reduced-motion` zeroing
  all transitions and animations from a single block.
- **Image loading is choreographed.** A reusable `CoverImage` component renders three
  states — colorful skeleton (rotating teal/gold/coral with a "Tuning in" label) →
  fade-in on `load` → `No cover` placeholder on `error`. Cached images skip the fade
  via an `onMounted` `image.complete` check. No layout shift; the parent owns the
  aspect ratio.
- **Magazine details deliberately included.** Numbered genre sections with rotating
  color-block headings, Abril Fatface display serif paired with Work Sans, fine-grain
  film noise overlay (inline SVG `feTurbulence`, theme-aware), 1° hover tilt on cards
  (the "picked up off a page"), warm-tinted everything (no `#000`,
  no `#FFF`, no cold blues anywhere).

## Project structure

```
src/
  api/             TVMaze HTTP client (TVMazeError, AbortSignal, no SDK).
  components/
    common/        Atoms: Brand, ThemeToggle, ShowCard, CoverImage.
    layout/        Page sections: AppLayout, AppHeader, AppFooter,
                   GenreSection, HorizontalShowList.
  composables/     useShows, useShow, useGenres.
  stores/          theme.ts (Pinia setup-style store with localStorage).
  views/           DashboardView, ShowDetailView, SearchView.
  router/          Routes + RouteMeta augmentation for nav metadata.
  style/           tokens.css, global.css, naive-theme.ts.
  tests/           composables/useGenres, stores/theme.
  types/           Show.ts (TVMaze API response shapes).
```

Routes are derived for the header nav from `meta.nav` on each route — adding a
navigable page is a single declaration, no second list to keep in sync.

## Running locally

**Install + run:**

```bash
npm install
npm run dev          # http://localhost:5173
```

**Other scripts:**

```bash
npm run build        # production build → dist/
npm run preview      # serve dist/ locally to verify production behavior
npm run test:unit    # Vitest in watch mode
npm run type-check   # vue-tsc
```

## Tests

Unit tests cover the parts where regressions cost the most:

- `src/tests/stores/theme.spec.ts` — initial theme resolution
  (localStorage / `prefers-color-scheme` / fallback), `toggle()` and `set()`
  persistence, `data-theme` attribute application, invalid stored values.
- `src/tests/composables/useGenres.spec.ts` — grouping, rating sort with
  null-rating handling, genre ordering with size + alphabetical tiebreak,
  `limitPerGenre` behavior, ref + getter reactivity, input non-mutation.

UI components are kept thin enough that breakage is caught by type-checking and
visible behavior; testing every Vue render is overhead I chose not to pay.

## Notes

- Show data and images are courtesy of [TVMaze](https://www.tvmaze.com/api). Their
  attribution request is honored in the footer.
- Fonts are Abril Fatface and Work Sans, loaded from Google Fonts with `display=swap`.
