# nexus-client — NEXUS Esports frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-live_updates-blueviolet)

The React 19 SPA for the **NEXUS Esports platform**: teams, players and tournaments with live match updates, an admin panel, dark/light theming and a code-split, mobile-first UI.

- 🌐 **Live**: <https://lively-water-080879d03.7.azurestaticapps.net>
- For the project-wide picture (backend, API reference, deployment): [root README](../../README.md) · [backend README](../../backend/README.md)

This document explains **how the frontend is put together and why each decision was made**, so you can extend it without reverse-engineering it.

## Table of contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Design system](#design-system--tailwind-css-v4-css-first)
- [Conventions](#conventions)
- [Deployment](#deployment)

## Quick start

Prerequisite: [Node.js](https://nodejs.org/) 20+.

```bash
cd frontend/nexus-client
npm install
npm run dev            # → http://localhost:5173
```

**Zero configuration needed for local dev**: every env var has a hardcoded fallback, so with the backend running on `https://localhost:7059` the app Just Works (see [backend/README.md](../../backend/README.md) to start and seed it).

To develop the frontend **against the deployed Azure API instead** (no local backend needed), create a `.env.local`:

```bash
VITE_API_URL=https://nexus-esports-api-ja.azurewebsites.net/api/
```

Browsing is fully public; admin features (create/edit/delete, recording match winners) appear after logging in via Auth0 with an account holding the `admin` role.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint (not ESLint) — config in .oxlintrc.json
```

> Measure performance (Lighthouse etc.) against `build` + `preview`, never the dev server — dev bundles are unminified and unrepresentative.

## Environment variables

Read via `import.meta.env.VITE_*`. **Every variable has a hardcoded local-dev fallback in code**, so the app runs with zero configuration against a locally running backend:

| Variable | Purpose | Fallback |
|---|---|---|
| `VITE_API_URL` | API base URL — must end with `/api/` | `https://localhost:7059/api/` |
| `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID` / `VITE_AUTH0_AUDIENCE` | Auth0 tenant config | dev tenant values |

`.env.production` overrides `VITE_API_URL` for the Azure deployment. The SignalR hub URL is **derived** from `VITE_API_URL` (replace `/api/` with `/hubs/matches`) so there's a single source of truth for "where is the backend".

## Project structure

```
src/
├── api/              # axios instance + one service per domain
├── auth/             # Auth0 provider
├── context/          # theme + global live-updates (SignalR) providers
├── hooks/            # use_is_admin, use_match_hub, …
├── lib/              # shared formatting/status logic
├── components/
│   ├── home/         # data-driven landing page
│   ├── teams/        # feature folders: *_screen / *_list / *_filter / *_form
│   ├── players/      #   + player detail with recharts analytics
│   ├── tournaments/  #   + tournament detail with live bracket
│   └── ui/           # shared primitives (modal, toast, pagination, …)
├── layout_template.jsx
├── App.jsx           # routes (code-split)
├── main.jsx          # provider stack
└── index.css         # the single stylesheet (Tailwind v4, CSS-first)
```

## Architecture

### Provider stack (`src/main.jsx`)

```
ThemeProvider → AuthProvider (Auth0) → LiveUpdatesProvider (SignalR) → BrowserRouter → App
```

Order matters: live updates render a toast that links into the router, and everything may need the theme, so theme sits outermost.

### Routing & code-splitting (`src/App.jsx`)

Only `HomeScreen` is imported eagerly; **every other screen is a `React.lazy()` import** under a single `Suspense`. Why: the player detail screen pulls in recharts (~420 KB), and code-splitting keeps that out of the initial bundle so first paint stays fast. **Add new routes as lazy imports** to preserve this.

`@` is an import alias for `/src` (configured in `vite.config.js`). Use `@/…` for cross-directory imports; relative imports within the same feature folder.

### API layer (`src/api/`)

- `api_client.js` — one shared axios instance with `baseURL` from `VITE_API_URL`.
- One service object per domain (`teams_service.js`, `players_service.js`, `tournaments_service.js`, `games_service.js`, `countries_service.js`, `upload_service.js`). Components consume `result.data`.
- **Auth pattern:** GET methods take no token. Write methods (POST/PUT/PATCH/DELETE) take a `token` as their **last argument** and set `Authorization: Bearer` per call. There is deliberately **no axios interceptor** — components fetch a fresh token via Auth0's `getAccessTokenSilently()` right before each write, which avoids stale-token bugs and keeps the public read path completely auth-free.
- **Pagination contract:** list endpoints return the page in the body and counts in the `x-pagination` response header. Read it as `JSON.parse(result.headers["x-pagination"])` → `{ TotalItemCount, TotalPageCount, … }` (PascalCase keys — it's serialized by .NET).

### Authentication & authorization

Auth0 via `@auth0/auth0-react` (`src/auth/auth0_provider.jsx`). Admin gating lives in `src/hooks/use_is_admin.js`, which reads the custom claim `user["https://nexus-esports.com/roles"]` and checks for `"admin"`. Use `useIsAdmin()` to conditionally render admin-only UI — but remember the **API is the real gate**; hiding a button is UX, not security.

### Live updates — two SignalR paths

Both connect to the hub derived from `VITE_API_URL`:

1. **Global** (`src/context/live_updates_context.jsx`) — one app-wide connection joins the `Global` group and listens for `GlobalMatchUpdated`. The latest event is exposed through `useLiveUpdates()` and rendered as a site-wide toast (`live_toast.jsx`) plus the home hero's "latest result" strip.
2. **Per-tournament** (`src/hooks/use_match_hub.js`) — `useMatchHub(tournamentId, onMatchUpdated)` joins that tournament's group on mount and leaves on unmount. The tournament detail screen uses it to **patch match state in place** (winner id + names) without refetching — this is what makes the bracket update live for every viewer.

### Screen orchestration pattern

Each feature folder (`teams/`, `players/`, `tournaments/`) follows the same shape:

- `*_screen.jsx` — **the stateful container.** Owns `filters` (incl. `pageNumber`/`pageSize`), the fetched list + pagination counts, `loading`, modal state (create/edit/delete), and a `toast`. Defines `handleCreate/Update/Delete` (fetch fresh token → call service → re-fetch list). Refetch is a `useEffect` keyed on `filters`.
- `*_list.jsx`, `*_filter.jsx`, `*_form.jsx` — **presentational.** Receive data + callbacks as props, hold no fetch logic.

Two deliberate details:
- `totalCount` starts as `null` (not `0`) and the header subtitle renders only once known — avoids a "0 teams" flash before the first fetch resolves.
- Grid column counts and page sizes are **paired** so pages fill their grid evenly: teams `xl:grid-cols-5`/pageSize 10, players `lg:grid-cols-4`/12, tournaments `xl:grid-cols-4`/8. `SkeletonGrid` takes the same grid `className` so the loading state matches the loaded layout exactly.

### Shared libs (`src/lib/`)

Single source of truth for logic that used to be copy-pasted:

- `format.js` — `formatMoney` (`$1.5M` / `$250K` / `$900`; `—` for null) and `humanize` (PascalCase enum → `Single Elimination`).
- `tournament_status.js` — `statusOf(status)` → `{ badge, icon, label, stripe }`. **Every** rendered status (badges, card stripes, hero, detail header, bracket) goes through this; never hand-pick status colors.

### Shared UI primitives (`src/components/ui/`)

Each file carries a doc-comment with its contract. The ones you'll reach for most:

| Component | What it is |
|---|---|
| `states.jsx` | `LoadingState` spinner + `EmptyState` card — used by every list, detail screen and chart section |
| `admin_bar.jsx` | "Admin Panel" banner + create button above list screens (render behind `useIsAdmin()`) |
| `card_admin_actions.jsx` | Hover-revealed edit/delete overlay on cards (always visible on touch devices via `pointer-coarse:`) |
| `form_field.jsx` | `FormField` (label + error slot, `full` spans the 2-col form grid) and `FormActions` (Cancel/Submit row) |
| `modal.jsx` / `confirm_delete.jsx` | Dialog (Escape/backdrop close, body scroll lock, `90dvh` cap) and the destructive-delete confirmation |
| `pagination.jsx` | Windowed pager; renders `null` when `totalPages <= 1`, so screens mount it unconditionally |
| `reveal.jsx` | Scroll-triggered fade/slide-up (IntersectionObserver, fires once, staggered via `delay`) |
| `back_link.jsx` | Uppercase "← All X" link on detail screens |
| `toast.jsx` / `live_toast.jsx` | Transient CRUD feedback / the SignalR match-result banner |
| `skeleton.jsx` / `image_uploader.jsx` / `scroll_to_top.jsx` | Loading placeholders, form image picker, floating scroll button |

## Design system — Tailwind CSS v4, CSS-first

Styling is Tailwind v4 via the `@tailwindcss/vite` plugin. Utilities live **in the JSX**; `src/index.css` is the single stylesheet.

### Theming
Brand/neon colors, backgrounds, text and border values are CSS variables in `:root`, overridden under `[data-theme="light"]`. An `@theme inline` block maps them onto Tailwind utilities (`bg-neon-cyan`, `text-text-secondary`, …) so **utilities follow theme switching automatically** — you never write dark-mode variants by hand. Theme is toggled by setting `data-theme` on `<html>` and persisted to `localStorage` (`theme_context.jsx`).

### Accent discipline (why the palette stays coherent)
Decorative color stays on the **cyan/violet brand pair**. The other neons are semantic only:
- **green** = live/real-time and money (prize pools, salaries, winners)
- **yellow** = upcoming/scheduled and awards
- **pink** = danger/destructive/cancelled

Status colors always come from `lib/tournament_status.js`. Non-semantic taxonomies get ONE consistent style (neutral chip for team regions, `badge-violet` for player roles) — never a per-value rainbow.

### Reused primitives (`@layer components`)
`glass-card`, `text-glow`, `btn-neon`(+`-violet`), `btn-neon-primary`, `btn-danger`, `btn-clear`, `btn-sm`, `badge-neon`/`badge-{violet,pink,green,yellow}`, `form-control`/`form-select`, `live-dot`, `fade-in-up`, `reveal`. Use these for those exact primitives; raw utilities for everything else.

### Motion system (native APIs only — no animation libraries)
- **Card spotlight** — `.glass-card::after` renders a cursor-tracked glow from `--mx`/`--my`, set by ONE delegated `pointermove` listener in `layout_template.jsx`. Every glass card gets it for free.
- **Page transitions** — internal `<Link>`s pass `viewTransition` (React Router + View Transitions API); styling lives in the `::view-transition-*` block. Add it to new internal links.
- **Scroll reveals** — use `<Reveal>` for below-the-fold content (`fade-in-up` animates on mount even off-screen, so it's for above-the-fold only). List cards stagger with `animationDelay = min(i * 0.05, 0.4)s`.
- **Reduced motion** — every ambient/entrance animation respects `prefers-reduced-motion` (`motion-reduce:animate-none` or a media block). Keep this when adding animation.

### Responsive rules (mobile-first)
- `html, body` use `overflow-x: clip` as a guard so decorative absolutely-positioned glows can never cause horizontal scrolling.
- `auto-fit`/`auto-fill` grids use `minmax(min(100%, Npx), 1fr)` so a min column width can never exceed a phone viewport.
- Fixed/floating overlays span `left-4 right-4` on mobile and dock with `sm:` (see `live_toast.jsx`).
- Hover-only affordances must have a touch equivalent (`pointer-coarse:` — see `card_admin_actions.jsx`).
- Modals cap at `90dvh` (dynamic viewport units — mobile browser toolbars).
- Touch targets ≥ ~44px (see the navbar hamburger).

### Charts (`players/player_stats_charts.jsx`)
recharts colors **must reference CSS variables** (`var(--neon-cyan)`, …), never hardcoded hexes, so charts follow theme switching. The Deaths line is dashed so it stays distinguishable from Kills under red-blind color vision. Single-series charts (K/D efficiency) skip the legend — the title names the series.

## Conventions

- Files are `snake_case` (`tournament_detail_screen.jsx`, `use_match_hub.js`).
- Function components + hooks; data fetching in `useEffect` with local `loading` state and try/catch that logs to console.
- JavaScript + JSX (no TypeScript), React 19, React Router 7.
- Content `<img>`s get `loading="lazy" decoding="async"` + explicit `width`/`height` (prevents layout shift); decorative images use `alt=""`.
- Accessibility: icon-only buttons need `aria-label`; active pagination page sets `aria-current="page"`; modals carry `role="dialog"` + `aria-modal`; filter selects/search inputs carry `aria-label`s; the tournament tabs use `role="tablist"`/`role="tab"` + `aria-selected`; a visually-hidden skip link targets `<main id="main">`.
- Copy is **sentence case** ("View details"), except intentionally-uppercase brand/eyebrow labels.
- One solid primary CTA (`btn-neon-primary`) per view; secondary actions are uppercase arrow text-links, not a second equal-weight button.
- `npm run lint` reports a few **intentional** warnings — leave them: `exhaustive-deps` on the fetch effects (fetch-on-`filters`-change is deliberate; adding deps loops) and `only-export-components` on the two context files (standard provider+hook pattern).

## Deployment

Every push to `main` that touches the frontend triggers `.github/workflows/azure-static-web-apps-*.yml`, which builds this app (`app_location: /frontend/nexus-client`, `output_location: dist`) and deploys it to **Azure Static Web Apps**. `.env.production` supplies the deployed `VITE_API_URL`; the Auth0 values ship with the build. No server-side code is deployed with the frontend — the API lives on Azure App Service ([backend/README.md](../../backend/README.md)).
