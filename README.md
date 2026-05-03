# Tele Iva

A TV listings dashboard built on the public [TVMaze API](https://www.tvmaze.com/api).
Shows are grouped by genre and sorted by rating; users can search by title, drill into
a show for synopsis, cast, and episodes, and follow a cast member through to the rest
of their filmography.

The visual identity is a deliberate departure from generic dashboards — warm cream
paper palette, Abril Fatface display serif, numbered genre sections, color blocks,
and a subtle film-grain overlay. The goal was to feel handmade and editorial rather
than templated. Every typography, color, and motion choice goes through CSS custom
properties so themes (light / dark) flip from a single attribute on `<html>`.

---

## Running locally

### Requirements

| | |
| --- | --- |
| **Node.js** | `^20.19.0 \|\| >=22.12.0` (declared in `package.json` `engines`) |
| **npm** | `>=10` (any version shipping with a supported Node release) |
| **Browser** | Any evergreen browser. Container queries and `useId` rely on baseline-2024 features |

`nvm use` will pick up the version range if a project-local `.nvmrc` is added; in the
meantime, `node --version` should print `v20.19.x`, `v22.x`, or newer.

### Commands

```bash
npm install          # install dependencies

npm run dev          # http://localhost:5173 with HMR
npm run build        # production build → dist/
npm run preview      # serve dist/ locally to verify the production bundle
npm run type-check   # vue-tsc --build, strict mode
npm run test:unit    # Vitest in watch mode
```

There are no environment variables, API keys, or local services required —
TVMaze is a public API and the app talks to it directly from the browser.

---

## Architectural decisions

### Stack — what and why

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Vue 3** (Composition API + `<script setup>`) | Brief required Vue. Composition API gives clean composable extraction and lets TypeScript inference work end-to-end. |
| Bundler | **Vite** | Fast dev start, native ESM HMR, function-form `defineConfig` makes the GitHub Pages base path conditional on build vs. dev. |
| Language | **TypeScript** (strict, `noUncheckedIndexedAccess`) | API responses, store contracts, and prop types are type-checked at the boundary. Catches the kind of bugs that would otherwise show up only when a particular code path runs. |
| Routing | **Vue Router** (createWebHistory) | Lazy route loading per dynamic import, named routes, typed `meta`. Clean URLs work on GitHub Pages via a 404.html SPA-fallback trick (see `vite.config.ts`). |
| UI state | **Pinia** | Two stores: `theme` and `search`. Both are genuine UI state shared across the tree (theme toggles every component; search drives header + dashboard hero + /search view). Nothing else justified a store. |
| Server state | **TanStack Vue Query** | Caching, automatic cancellation via `AbortSignal`, request dedupe, and `enabled` gating for tab-lazy fetches — all primitives I'd otherwise have to write by hand. |
| Component primitives | **Naive UI** | `NCard`, `NButton`, `NInput`, `NTabs`, `NCollapse`, `NTable`, `NTag`, `NIcon`, `NConfigProvider`. Themed via overrides driven from the same design tokens as the rest of the app. |
| Search | **Fuse.js** | Fuzzy in-memory search over the cached show list, name-only per the brief. No extra API call — reuses the show index already in the Vue Query cache. |
| Tests | **Vitest + Vue Test Utils** | First-party Vite integration; same module graph and TS config as the app. |

Minimal dependencies is a deliberate choice. No utility-CSS framework, no icon
library, no extra component kit — every dependency earns its weight.

### Separation of server state and UI state

This is the architectural rule that does the most work. **Fetched data lives in
Vue Query, never in Pinia.** Pinia stores only own values that genuinely cross
component boundaries and aren't derivable from a URL or fetch:

- `useThemeStore` — current theme + persistence
- `useSearchStore` — the live search input value plus its 300 ms debounced derivative

The "server data into Pinia" antipattern (manual cache, manual loading flags,
manual cancellation) is one of the easiest ways to spend a weekend reinventing
half of TanStack Query. Avoided.

Concretely: `useShows`, `useShow`, `useCast`, `useEpisodes`, `usePerson`, and
`usePersonCredits` are all Vue Query composables with `staleTime: 1 hour`.
The actor's filmography uses TVMaze's `embed=show` query parameter so a single
request hydrates every show in their cast credits — no per-credit fan-out.

### Search: URL is the source of truth

Search has two visible inputs (a header field and a dashboard hero) plus the
results page. Coordinating those by hand would multiply state. Instead:

- The URL's `?q=` is the source of truth.
- `useSearchStore.query` is the input value bound by `v-model`; `debouncedQuery`
  is its 300 ms-debounced sibling.
- `useSearchNavigation` mounts once in `AppLayout` and keeps URL ↔ store in
  sync: typing on the dashboard pushes to `/search?q=…` after the debounce
  settles; typing on `/search` replaces in place (no per-keystroke history
  entries); back/forward and deep-link entries seed the store from `?q=`.
- Equality short-circuits in both watchers prevent the store→URL→store loop.

The result: deep-linkable, shareable search URLs; back-button works as users
expect; type-to-route from the dashboard hero feels seamless because the
search field on `/search` autofocuses on mount.

### Lazy data, lazy code

- **Routes** are dynamic-imported in `router/index.ts`, so each view is its
  own chunk. `dashboard` is the only chunk on first paint.
- **Tabs lazy-fetch** their data: `CastTab` and `EpisodesTab` accept an
  `enabled` boolean prop that flips the underlying Vue Query `enabled`
  flag. The default `Cast` tab fetches on mount; `Episodes` doesn't fetch
  until the user clicks the tab. Once activated, an "ever-active" sentinel
  keeps the tab populated so re-clicking doesn't trigger a refetch dance.
- **Cast preview** shows the first two rows by default (computed from the
  grid's actual rendered width via `ResizeObserver`, so the cutoff matches
  the layout on every viewport). A `Show all` toggle reveals the rest.
- **Seasons collapse** by default. Single-season shows auto-expand the lone
  season — collapsing a 6-episode miniseries solves nothing and adds friction.
- **Image loading** is choreographed by `CoverImage`: colorful skeleton →
  fade-in → `No cover` placeholder. Cached images skip the fade via an
  `image.complete` check on mount. Parent owns aspect ratio; no layout shift.

### Design tokens drive everything

All colors, type scale, spacing, radii, and motion durations live in
`src/style/tokens.css` as CSS custom properties. Light and dark themes are two
blocks under `[data-theme="light"]` / `[data-theme="dark"]`; switching the
attribute on `<html>` flips every styled component instantly. Naive UI's
`themeOverrides` object in `src/style/naive-theme.ts` mirrors these as concrete
hex values (Naive's color parser doesn't accept `var()`).

An inline `<script>` in `index.html` reads the stored theme + system preference
and sets `data-theme` before paint, which prevents the dark-mode flash. A small
bootstrap loading screen renders inside `#app` from raw HTML so users see
something the moment HTML parses, before the JS bundle finishes downloading.
Vue replaces it on mount.

`<link rel="preconnect">` warms the connections to `api.tvmaze.com` and
`static.tvmaze.com` so DNS, TCP, and TLS run in parallel with the bundle
download.

### Accessibility — non-negotiable

- Semantic landmarks throughout (`<main>`, `<nav>`, `<article>`, `<section>`).
- Search has a labeled input (`<label>` wraps the field), `role="status"` +
  `aria-live="polite"` for the result count.
- Horizontal scrollable lists carry `role="list"` (defends against the
  VoiceOver "list-style: none drops list semantics" bug) and arrow-key
  navigation.
- Genre and content sections use `aria-labelledby` to associate headings.
- Icon-only buttons (theme toggle, social links) have explicit `aria-label`.
- `:focus-visible` ring is 3 px gold (`--color-secondary`) — never `outline:
  none` without a clear replacement.
- `prefers-reduced-motion` zeroes animation/transition durations from a
  single global block.
- The collapsible seasons (`NCollapse`) and tabs (`NTabs`) inherit Naive UI's
  built-in keyboard support and ARIA wiring; the `Show all cast members`
  button carries `aria-expanded` + `aria-controls` pointing to the grid.

### Magazine details

The small choices that separate "AI-generated retro" from "actually designed":

- Inline-SVG `feTurbulence` film-grain overlay on the body, theme-aware.
- Numbered genre sections with rotating color-block underlines.
- Polaroid-on-corkboard tilt on cast cards (alternating ±1°, straightens on hover).
- 1° tilt on show cards hover (the "picked up off a page" feel).
- Eyebrow labels (small caps, wider letter-spacing) marking sections.
- Active tab carries a 4 px color block whose color rotates per tab — Cast
  wears teal, Episodes wears gold. Drives off a single CSS variable so the
  swap animates.
- Coral (accent), gold (secondary), teal (primary) cycle through cast frames,
  season headings, and skeleton states.
- Warm-tinted everything. No `#000`, no `#FFF`, no cold blues anywhere.

---

## Project structure

```
src/
  api/
    tvmaze.ts                 # HTTP client, AbortSignal threading, no SDK
  components/
    common/                   # Atomic, app-agnostic
      BackLink.vue
      Brand.vue
      CoverImage.vue
      SearchField.vue         # NInput bound to the search store
      ShowCard.vue
      ThemeToggle.vue
    layout/                   # Page chrome
      AppFooter.vue
      AppHeader.vue
      AppLayout.vue           # Mounts useSearchNavigation()
      GenreSection.vue
      HorizontalShowList.vue
    show/                     # Show-detail-specific
      CastTab.vue             # Two-row preview + Show all toggle
      EpisodesTab.vue         # Collapsible seasons (NCollapse)
  composables/
    useCast.ts                # Vue Query: cast for a show
    useDebounce.ts            # Generic Ref<T> → debounced Ref<T>
    useEpisodes.ts            # Vue Query: episodes for a show
    useGenres.ts              # Pure: group + sort shows by genre
    usePerson.ts              # Vue Query: person + credits with embedded shows
    useSearch.ts              # Reactive Fuse.js wrapper
    useSearchNavigation.ts    # URL ↔ search-store sync (mounted once)
    useShow.ts
    useShows.ts
  stores/
    search.ts                 # Pinia: query + debouncedQuery
    theme.ts                  # Pinia: theme + persistence
  views/
    DashboardView.vue
    PersonDetailView.vue      # Filmography sorted by rating-then-name
    SearchView.vue
    ShowDetailView.vue        # Hero + Synopsis + Tabs + Facts table
  router/
    index.ts                  # Lazy routes, RouteMeta augmentation
  style/
    tokens.css                # All design tokens (light + dark)
    global.css                # Reset, typography, focus, film grain
    naive-theme.ts            # Naive UI override objects
  tests/
    composables/              # useDebounce, useGenres, useSearch
    stores/                   # search, theme
  types/
    show.ts                   # TVMaze API response shapes
```

Routes are derived for the header nav from `meta.nav` on each route — adding
a navigable page is a single declaration, no second list to keep in sync.

---

## Features

- **Dashboard** — shows grouped by genre, sorted by rating descending, capped
  at 12 per genre. Editorial hero search at the top; type to be taken straight
  to `/search?q=…`.
- **Search** — fuzzy search by title with Fuse.js, 300 ms debounce, URL-driven
  query, accessible clearable input with name-only matching. Result count is
  `aria-live`-announced.
- **Show detail** — hero with cover, masthead, genres, rating, network. Synopsis.
  Cast / Episodes tabs (lazy-fetched). "On the dial" facts table.
- **Cast tab** — first two rows visible by default (computed from actual grid
  width); `Show all NN cast members` toggle. Polaroid-tilt cards link to the
  actor page.
- **Episodes tab** — seasons collapsed by default (single-season shows
  auto-expand). TOC-style episode rows.
- **Actor page** — `/people/:id` with the actor's headshot, country, life dates,
  and filmography rendered as `ShowCard`s sorted by rating. Credits + every
  show inline in a single request via TVMaze's `embed=show`.
- **Theming** — light / dark, persisted to `localStorage`, system-preference
  fallback. No FOUC; `data-theme` is set before first paint.

---

## Tests

Unit tests live in `src/tests/`:

| File | Covers |
| --- | --- |
| `composables/useDebounce.spec.ts` | initial seed, delay, latest-wins on bursts, scope-disposal cancellation |
| `composables/useGenres.spec.ts` | grouping, rating sort with null handling, alphabetical tiebreak, `limitPerGenre`, ref + getter reactivity, input non-mutation |
| `composables/useSearch.spec.ts` | empty / whitespace queries, exact match, fuzzy typo, name-only enforcement, limit, query reactivity, source reactivity, undefined source |
| `stores/search.spec.ts` | initial empty, immediate query writes, debounced propagation, `clear()` propagation, latest-wins on bursts |
| `stores/theme.spec.ts` | initial resolution (localStorage / `prefers-color-scheme` / fallback), `toggle()`, `set()`, `data-theme` application, invalid stored values |

`npm run test:unit` runs them all in watch mode; CI invokes `vitest run` (via
type-check + build in the deploy workflow).

The unit-test focus is on logic that would silently break: pure composables,
the search store's debounce semantics, and the theme store's persistence
edges. UI components are kept thin enough that breakage is caught by
type-checking and the build, plus visible behavior; testing every Vue render
is overhead I chose not to pay.

---

## Deployment

The app deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
The workflow builds, uploads `dist/` as a Pages artifact, and deploys to the
`github-pages` environment using the official actions
(`configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`).

`vite.config.ts` switches the base path conditionally — `/tele-iva/` for
`vite build`, `/` for `vite dev` — and a small inline plugin copies
`dist/index.html` to `dist/404.html` on build. GitHub Pages serves `404.html`
for any unmatched URL, which gives `createWebHistory` clean URLs (no `/#/`
prefix) without server-side rewriting.

To enable deployment for the first time:

1. Push to `LucySpass/tele-iva` (the repo name has to match the base path).
2. Repo → Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Subsequent pushes to `main` deploy automatically.

---

## Attributions

- Show data and images courtesy of [TVMaze](https://www.tvmaze.com/api). The
  attribution request is honored in the footer.
- Fonts are [Abril Fatface](https://fonts.google.com/specimen/Abril+Fatface)
  and [Work Sans](https://fonts.google.com/specimen/Work+Sans) from Google
  Fonts, loaded with `display=swap`.
