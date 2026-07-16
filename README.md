# 🎮 NEXUS — Esports Management Platform

A full-stack esports management platform: teams, players and tournaments with **live match updates** pushed to every connected browser in real time.

- **Frontend** — React 19 SPA (Vite, Tailwind CSS v4, recharts, SignalR client) → deployed to **Azure Static Web Apps**
- **Backend** — ASP.NET Core Web API (.NET 10, EF Core, SignalR hub, Auth0 JWT) → deployed to **Azure App Service** (Docker)

## Repository layout

```
nexus-esports/
├── backend/
│   ├── Nexus.API/            # Web API host: controllers, SignalR hub, mapping profiles
│   ├── Nexus.Contracts/      # DTOs shared between layers (incl. pagination metadata)
│   ├── Nexus.Domain/         # Entities and domain rules
│   └── Nexus.Infrastructure/ # EF Core, repositories, external services (REST Countries)
├── frontend/
│   └── nexus-client/         # React SPA — has its own README with the full frontend docs
└── .github/workflows/        # CI/CD: backend container deploy + Azure Static Web Apps
```

## How it works (the big picture)

### Data flow
The SPA talks to the API over REST (`axios`). List endpoints return the page of results in the body and the counts in an **`x-pagination` response header** (`TotalItemCount`, `TotalPageCount`, …) — the frontend reads both to render grids and pagers. Filtering, searching and paging are all **server-side**; the frontend only sends query params.

### Authentication & authorization
[Auth0](https://auth0.com) issues JWTs. **Reading is public** — anyone can browse teams, players and tournaments. **Writing is admin-only**: the API validates the bearer token and requires the `admin` role, which Auth0 injects as a custom claim (`https://nexus-esports.com/roles`). The frontend reads the same claim to decide whether to *show* admin UI (create/edit/delete), but the API is the actual gate.

### Real-time updates (the headline feature)
When an admin records a match winner, the API broadcasts it through a **SignalR hub** (`/hubs/matches`):

1. **Global group** — every connected client receives `GlobalMatchUpdated` and shows a site-wide toast ("Team X defeated Team Y").
2. **Per-tournament group** — clients viewing that tournament receive `MatchUpdated` and patch the bracket in place, no refetch, no reload.

This is why two people watching the same bracket both see the winner appear the moment it's recorded.

### Why the backend is layered
`API → Infrastructure → Domain` with DTOs in `Contracts`: controllers stay thin, EF Core specifics stay in Infrastructure behind repository interfaces, and the domain entities never leak to the wire (AutoMapper maps entities ⇄ DTOs). This keeps the database schema and the public API free to evolve independently.

## Tech stack

| Layer | Technology | Used for |
|---|---|---|
| Frontend | React 19 + Vite | SPA with code-split routes |
| | Tailwind CSS v4 | CSS-first design system (dark/light theming via CSS variables) |
| | React Router 7 | Routing + View Transitions |
| | @microsoft/signalr | Live match updates |
| | recharts | Player performance analytics |
| | @auth0/auth0-react | Login + token acquisition |
| Backend | ASP.NET Core (.NET 10) | REST API + SignalR hub |
| | EF Core (code-first) | SQL Server persistence, migrations |
| | AutoMapper | Entity ⇄ DTO mapping |
| | Serilog | Structured logging |
| | Bogus | Realistic seed data (`POST /api/seed/all`) |
| Auth | Auth0 | JWT auth, `admin` role claim |
| Hosting | Azure Static Web Apps + App Service | Frontend / backend deploys via GitHub Actions |

## Getting started

### Backend
1. Open `backend/Nexus.sln` (Visual Studio or `dotnet` CLI).
2. Set your connection string in `appsettings.Development.json` (SQL Server LocalDB works out of the box).
3. Apply migrations: `Update-Database` (Package Manager Console) or `dotnet ef database update`.
4. Run the API — it listens on `https://localhost:7059` by default.
5. Seed realistic demo data: `POST /api/seed/all`.

### Frontend
```bash
cd frontend/nexus-client
npm install
npm run dev
```
The dev server proxies nothing — the app calls the API directly. Without a `.env` file it falls back to `https://localhost:7059/api/`, so a locally running backend Just Works. See `frontend/nexus-client/README.md` for env vars, architecture and conventions.

## API overview

All list endpoints support filtering, searching and pagination (`pageNumber`, `pageSize`) and return counts in the `x-pagination` header.

| Resource | Endpoints |
|---|---|
| Teams | `GET/POST /api/teams`, `GET/PUT/DELETE /api/teams/{id}` |
| Players | `GET/POST /api/players`, `GET/PUT/DELETE /api/players/{id}` (detail includes per-match stats + achievements) |
| Tournaments | `GET/POST /api/tournaments`, `GET/PUT/DELETE /api/tournaments/{id}` (detail includes stages + registered teams) |
| Matches | `GET /api/tournaments/{id}/matches`, `PATCH …/matches/{id}` (set winner → SignalR broadcast) |
| Games / Countries | `GET /api/games`, `GET /api/countries` (reference data for filters and forms) |
| Uploads | `POST /api/upload` (images for logos/photos; admin-only) |
| Seed | `POST /api/seed/all` (Bogus-generated demo data) |

Write endpoints (`POST`/`PUT`/`PATCH`/`DELETE`) require a bearer token with the `admin` role.

## Deployment

- **Frontend** — `.github/workflows/azure-static-web-apps-*.yml` builds `frontend/nexus-client` and deploys to Azure Static Web Apps. `.env.production` points `VITE_API_URL` at the deployed API.
- **Backend** — `.github/workflows/backend-deploy.yml` builds the Docker image (`backend/Nexus.API/Dockerfile`) and deploys it.

Both run automatically on pushes to `main` that touch their half of the repo.

## 👨‍💻 Author

Jairo Nacurena Tuy — [LinkedIn](https://www.linkedin.com/in/jairo-nacurena) — [GitHub](https://github.com/J41r0Ps)
