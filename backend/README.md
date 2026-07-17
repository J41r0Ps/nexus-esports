# Nexus.API — Backend

The ASP.NET Core (.NET 10) backend for the [NEXUS Esports platform](../README.md): a REST API with a SignalR hub for live match updates, Auth0 JWT authentication, EF Core (SQL Server) persistence, and integrations with real esports data sources.

- **Live API**: <https://nexus-esports-api-ja.azurewebsites.net> — interactive docs at [`/swagger`](https://nexus-esports-api-ja.azurewebsites.net/swagger)
- **Local dev**: `https://localhost:7059` — Swagger at `/swagger`

## Table of contents

- [Solution structure](#solution-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Database & migrations](#database--migrations)
- [Database seeding](#database-seeding)
- [Authentication & authorization](#authentication--authorization)
- [API reference](#api-reference)
- [Pagination contract](#pagination-contract)
- [SignalR hub contract](#signalr-hub-contract)
- [External integrations](#external-integrations)
- [Docker & deployment](#docker--deployment)

## Solution structure

The solution (`backend.slnx`) is layered so that controllers stay thin, persistence details stay isolated, and domain entities never leak to the wire:

```
Nexus.API            →  Nexus.Infrastructure  →  Nexus.Domain
      ↘ Nexus.Contracts (DTOs) ↙
```

| Project | Responsibility |
|---|---|
| **Nexus.API** | Web host: controllers, `MatchHub` (SignalR), AutoMapper profiles, DI wiring (`Program.cs`), Dockerfile |
| **Nexus.Contracts** | DTOs per resource (`Models/…`) + `PaginationMetadata`. The only types that cross the wire |
| **Nexus.Domain** | Entities (`Team`, `Player`, `Tournament`, `Match`, `Stage`, `Organization`, `Sponsor`, `Achievement`, `PlayerStat`, …) and enums |
| **Nexus.Infrastructure** | `NexusContext` (EF Core), repositories behind interfaces (`Services/`), EF migrations, Bogus seeders (`Seeders/`), external API clients (`ExternalServices/`), e-mail strategies (`Strategies/`) |

Design notes:

- **AutoMapper** maps entities ⇄ DTOs in both directions; controllers never return an entity.
- **Enums serialize as strings** (`JsonStringEnumConverter`) — clients receive `"SingleElimination"`, not `2`.
- **E-mail strategy pattern**: `IEmailService` resolves to `ConsoleEmailService` in Development (prints to console) and `MailtrapEmailService` in Production.
- **CORS** allows the configured frontend origins and explicitly exposes the `X-Pagination` header.

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server LocalDB (ships with Visual Studio) or any reachable SQL Server

### Run

```bash
cd backend
dotnet ef database update --project Nexus.Infrastructure --startup-project Nexus.API
dotnet run --project Nexus.API
```

The API listens on `https://localhost:7059`. Open `https://localhost:7059/swagger` to explore and test every endpoint interactively.

Ready-made HTTP request collections live next to the project: `Nexus.API/Nexus.API.http` and `Nexus.API/seed-azure.http` (usable from Visual Studio / VS Code REST Client).

## Configuration

Configuration lives in `Nexus.API/appsettings.Development.json` (local) and `appsettings.Production.json` (deployed). Keys:

| Key | Purpose |
|---|---|
| `ConnectionStrings:NexusDBConnectionString` | SQL Server connection string (LocalDB by default in Development) |
| `Auth0:Authority` / `Auth0:Audience` | Auth0 tenant + API audience used to validate JWTs |
| `Cors:AllowedOrigins` | Array of allowed frontend origins |
| `ExternalApis:Rawg` / `PandaScore` / `RestCountries` | Base URLs + API keys for the seeding data sources |
| `Cloudinary:*` | Image-upload credentials |
| `EmailSettings:*` | Sender address; SMTP settings (Mailtrap) in Production |
| `AutoMapperKey` | AutoMapper license key |

> ⚠️ **Secrets** (API keys, connection-string passwords, SMTP credentials) should be supplied via environment variables, `dotnet user-secrets`, or Azure App Service configuration — not committed to source control.

## Database & migrations

EF Core is **code-first**; migrations live in `Nexus.Infrastructure/Migrations`. `Nexus.Infrastructure` is the migrations assembly and `Nexus.API` is always the startup project:

```bash
# apply latest schema
dotnet ef database update --project Nexus.Infrastructure --startup-project Nexus.API

# add a new migration
dotnet ef migrations add <Name> --project Nexus.Infrastructure --startup-project Nexus.API
```

(Or `Update-Database` / `Add-Migration` in the Visual Studio Package Manager Console with `Nexus.Infrastructure` as the default project.)

## Database seeding

The seeder builds a **realistic demo dataset from real sources**: games from **RAWG**, countries from **REST Countries**, teams and players from **PandaScore** (real orgs and rosters), then Bogus-generated tournaments, brackets, stats and achievements on top.

All seed endpoints are **admin-only** (bearer token with the `admin` role). Each endpoint validates its dependencies, so call them **in this order**:

```
POST /api/seed/games            # real games via RAWG
POST /api/seed/countries        # real countries via REST Countries
POST /api/seed/organizations
POST /api/seed/teams            # real teams via PandaScore
POST /api/seed/players          # real players via PandaScore
POST /api/seed/sponsors
POST /api/seed/team-sponsors
POST /api/seed/tournaments
POST /api/seed/stages
POST /api/seed/registrations
POST /api/seed/matches
POST /api/seed/player-stats
POST /api/seed/achievements
```

To wipe everything and start over:

```
DELETE /api/seed/reset
```

`Nexus.API/seed-azure.http` contains the full sequence ready to execute.

## Authentication & authorization

- **Auth0** issues JWTs; the API validates them against the configured `Authority`/`Audience`.
- **Reads are anonymous** — every `GET` endpoint is public.
- **Writes are protected** by the `AdminOnly` policy: the token must carry the custom claim `https://nexus-esports.com/roles` containing `admin` (injected by an Auth0 Action).

To call a protected endpoint manually, obtain a token (e.g. log in through the frontend and copy it, or use Auth0's token endpoint) and send it as:

```
Authorization: Bearer <token>
```

## API reference

Base URL: `https://localhost:7059/api` (local) or `https://nexus-esports-api-ja.azurewebsites.net/api` (deployed).

🔒 = requires `admin` bearer token. Everything else is public.

### Health

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Liveness probe |

### Teams

| Method | Route | Description |
|---|---|---|
| GET | `/api/teams` | Paged list. Query: `searchQuery`, `region`, `gameId`, `pageNumber`, `pageSize` |
| GET | `/api/teams/{id}` | Team detail (roster, organization, sponsors) |
| 🔒 POST | `/api/teams` | Create a team |
| 🔒 PUT | `/api/teams/{id}` | Update a team |
| 🔒 DELETE | `/api/teams/{id}` | Delete a team |
| 🔒 POST | `/api/teams/{teamId}/sponsors/{sponsorId}` | Attach a sponsor to a team |
| 🔒 DELETE | `/api/teams/{teamId}/sponsors/{sponsorId}` | Detach a sponsor from a team |

### Players

| Method | Route | Description |
|---|---|---|
| GET | `/api/players` | Paged list. Query: `searchQuery`, `role`, `teamId`, `countryId`, `pageNumber`, `pageSize` |
| GET | `/api/players/{id}` | Player detail **including per-match stats and achievements** (feeds the frontend charts) |
| 🔒 POST | `/api/players` | Create a player |
| 🔒 PUT | `/api/players/{id}` | Update a player |
| 🔒 DELETE | `/api/players/{id}` | Delete a player |

### Tournaments

| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments` | Paged list. Query: `searchQuery`, `status`, `format`, `gameId`, `pageNumber`, `pageSize` |
| GET | `/api/tournaments/{id}` | Tournament detail including stages and registered teams |
| 🔒 POST | `/api/tournaments` | Create a tournament |
| 🔒 PUT | `/api/tournaments/{id}` | Update a tournament |
| 🔒 DELETE | `/api/tournaments/{id}` | Delete a tournament |

`status` and `format` accept the enum **names** (e.g. `Ongoing`, `SingleElimination`) since enums are serialized as strings.

### Tournament registrations

| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments/{tournamentId}/registrations` | Teams registered for a tournament |
| POST | `/api/tournaments/{tournamentId}/registrations` | Register a team (`teamId`, `seedNumber`, `contactEmail`) — sends a **confirmation e-mail** to the contact address |
| 🔒 DELETE | `/api/tournaments/{tournamentId}/registrations/{teamId}` | Unregister a team |

### Stages

| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments/{tournamentId}/stages` | Stages of a tournament (groups, playoffs, final, …) |
| GET | `/api/tournaments/{tournamentId}/stages/{stageId}` | Single stage detail |

### Matches

| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments/{tournamentId}/matches` | All matches of a tournament (feeds the bracket) |
| GET | `/api/tournaments/{tournamentId}/matches/{matchId}` | Single match detail |
| 🔒 PATCH | `/api/tournaments/{tournamentId}/matches/{matchId}` | **Record the winner.** Body: `{ "winnerId": <teamId> }` — must be one of the two competing teams. On success the result is **broadcast over SignalR** (see [hub contract](#signalr-hub-contract)) |

### Reference data

| Method | Route | Description |
|---|---|---|
| GET | `/api/games` | All games (filter/form options) |
| GET | `/api/countries` | All countries |
| GET | `/api/countries/with-players` | Only countries that currently have players (used for filters) |

### Uploads

| Method | Route | Description |
|---|---|---|
| 🔒 POST | `/api/upload/image?folder={folder}` | `multipart/form-data` with a `file` field. Uploads to Cloudinary and returns `{ "url": "…" }`. Allowed folders: `teams`, `players`, `tournaments`, `sponsors`, `misc` (default) |

### Seed

See [Database seeding](#database-seeding) — thirteen 🔒 `POST /api/seed/{resource}` endpoints plus 🔒 `DELETE /api/seed/reset`.

## Pagination contract

List endpoints return the page of results in the **body** and the counts in an **`x-pagination` response header** (JSON, PascalCase — exposed via CORS):

```json
{ "TotalItemCount": 87, "TotalPageCount": 9, "PageSize": 10, "CurrentPage": 1 }
```

`pageSize` is capped server-side (max 50). Clients read the header — e.g. the frontend does `JSON.parse(response.headers["x-pagination"])`.

## SignalR hub contract

Hub endpoint: **`/hubs/matches`** (same host as the API).

**Client → server** (group management):

| Method | Effect |
|---|---|
| `JoinGlobal()` / `LeaveGlobal()` | Join/leave the `global-matches` group |
| `JoinTournament(tournamentId)` / `LeaveTournament(tournamentId)` | Join/leave the `tournament-{id}` group |

**Server → client** (fired when an admin records a match winner):

| Event | Sent to | Payload |
|---|---|---|
| `MatchUpdated` | `tournament-{id}` group | Full `MatchDetailsDto` — used to patch the bracket in place |
| `GlobalMatchUpdated` | `global-matches` group | Summary (winner/loser names, tournament) — used for the site-wide toast |

## External integrations

| Service | Used for | Where |
|---|---|---|
| **PandaScore** | Real esports teams and player rosters for seeding | `ExternalServices/PandaScore` |
| **RAWG** | Real video-game catalog for seeding | `ExternalServices/Rawg` |
| **REST Countries** | Country reference data for seeding | `ExternalServices/RestCountries` |
| **Cloudinary** | Image hosting for the upload endpoint | `ExternalServices/Cloudinary` |
| **Mailtrap** | SMTP for registration confirmation e-mails (Production; Development logs to console) | `Strategies/` |

## Docker & deployment

The API ships as a container (`Nexus.API/Dockerfile`):

```bash
cd backend
docker build -f Nexus.API/Dockerfile -t nexus-esports-api .
```

CI/CD: `.github/workflows/backend-deploy.yml` runs on every push to `main` touching `backend/**` — it builds the solution, builds and pushes the Docker image, and deploys it to **Azure App Service** (`nexus-esports-api-ja`). Production configuration (connection string, Auth0 audience, CORS origins) comes from `appsettings.Production.json` / App Service settings.
