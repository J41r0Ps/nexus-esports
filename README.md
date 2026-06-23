# 🎮 NEXUS — Esports Management Platform

A full-stack esports management platform built with ASP.NET Core and React.

## 🛠️ Tech Stack

### Backend

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (Code-First)
- AutoMapper
- Auth0 (JWT Authentication)
- Serilog (Logging)
- Bogus (Seed Data)
- Repository Pattern + Layered Architecture

### Frontend

- React + Vite
- React Router DOM
- Axios
- Auth0 React SDK
- Bootstrap 5

## 📦 Database

- SQL Server LocalDB (Development)
- 15+ tables covering Teams, Players, Tournaments, Matches, Games, Sponsors

## 🚀 Getting Started

### Backend

1. Clone the repo
2. Open `backend/Nexus.sln` in Visual Studio
3. Update connection string in `appsettings.Development.json`
4. Run migrations: `Add-Migration InitialCreate` → `Update-Database`
5. Seed data: `POST /api/seed/all`
6. Run the API

### Frontend

1. Navigate to `frontend/nexus-client`
2. Run `npm install`
3. Run `npm run dev`

## 📌 API Endpoints

### Teams

- `GET /api/teams` — list with filtering + pagination
- `GET /api/teams/{id}` — team details with players
- `POST /api/teams` — create team
- `PUT /api/teams/{id}` — update team
- `DELETE /api/teams/{id}` — delete team

### Players

- `GET /api/players` — list with filtering + pagination
- `GET /api/players/{id}` — player details
- `POST /api/players` — create player
- `PUT /api/players/{id}` — update player
- `DELETE /api/players/{id}` — delete player

### Tournaments

- `GET /api/tournaments` — list with filtering + pagination
- `GET /api/tournaments/{id}` — tournament details
- `POST /api/tournaments` — create tournament
- `PUT /api/tournaments/{id}` — update tournament
- `DELETE /api/tournaments/{id}` — delete tournament

## 👨‍💻 Author

Jairo Nacurena Tuy — [LinkedIn](https://www.linkedin.com/in/jairo-nacurena) — [GitHub](https://github.com/J41r0Ps)
