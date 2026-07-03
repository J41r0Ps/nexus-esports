using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.DbContexts;
using Nexus.Infrastructure.ExternalServices.PandaScore;
using Nexus.Infrastructure.ExternalServices.Rawg;
using Nexus.Infrastructure.ExternalServices.RestCountries;
using Nexus.Infrastructure.Seeders;

namespace Nexus.API.Controllers
{
    [Route("api/seed")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly NexusContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IRawgService _rawg;
        private readonly ICountryDataService _countryApi;
        private readonly IPandaScoreService _pandaScore;

        public SeedController(NexusContext context, IWebHostEnvironment env, IRawgService rawg, ICountryDataService countryApi, IPandaScoreService pandaScore)
        {
            _context = context;
            _env = env;
            _rawg = rawg;
            _countryApi = countryApi;
            _pandaScore = pandaScore;
        }

        [Authorize(Policy = "AdminOnly")] 
        [HttpDelete("reset")]
        public async Task<IActionResult> ResetDatabase()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            // Delete in FK-safe order
            _context.PlayerStats.RemoveRange(_context.PlayerStats);
            _context.Achievements.RemoveRange(_context.Achievements);
            _context.TournamentRegistrations.RemoveRange(_context.TournamentRegistrations);
            _context.Matches.RemoveRange(_context.Matches);
            _context.TeamSponsors.RemoveRange(_context.TeamSponsors);
            _context.Players.RemoveRange(_context.Players);
            _context.Stages.RemoveRange(_context.Stages);
            _context.Tournaments.RemoveRange(_context.Tournaments);
            _context.Teams.RemoveRange(_context.Teams);
            _context.Sponsors.RemoveRange(_context.Sponsors);
            _context.Organizations.RemoveRange(_context.Organizations);
            _context.Games.RemoveRange(_context.Games);
            _context.Countries.RemoveRange(_context.Countries);

            await _context.SaveChangesAsync();

            // Reset identity counters
            var tables = new[]
            {
                "PlayerStats", "Achievements", "TournamentRegistrations", "Matches",
                "TeamSponsors", "Players", "Stages", "Tournaments",
                "Teams", "Sponsors", "Organizations", "Games", "Countries"
            };

            foreach (var table in tables)
            {
                await _context.Database.ExecuteSqlRawAsync(
                    $"DBCC CHECKIDENT ('{table}', RESEED, 0)");
            }

            return Ok(new
            {
                message = "Database reset successfully! All tables cleared, identity counters reset to 0.",
                tablesReset = tables.Length
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("games")]
        public async Task<IActionResult> SeedGames()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (_context.Games.Any())
                return BadRequest(new { message = "Games already seeded." });

            var seeder = new GameSeeder(_rawg);
            var games = await seeder.GenerateAsync();

            _context.Games.AddRange(games);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Games seeded successfully with real data from RAWG!",
                count = games.Count,
                games = games.Select(g => new
                {
                    g.Id,
                    g.Name,
                    Genre = g.Genre.ToString(),
                    g.Publisher,
                    g.CoverImageUrl
                })
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("countries")]
        public async Task<IActionResult> SeedCountries()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (_context.Countries.Any())
                return BadRequest(new { message = "Countries already seeded." });

            var seeder = new CountrySeeder(_countryApi);
            var countries = await seeder.GenerateAsync();

            _context.Countries.AddRange(countries);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Countries seeded successfully with real data + flags!",
                count = countries.Count
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("organizations")]
        public async Task<IActionResult> SeedOrganizations()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (_context.Organizations.Any())
                return BadRequest("Organizations already seeded.");

            var seeder = new OrganizationSeeder();
            var orgs = seeder.Generate();

            _context.Organizations.AddRange(orgs);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Real esports orgs seeded!", count = orgs.Count });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("teams")]
        public async Task<IActionResult> SeedTeams()
        {
            if (!_env.IsDevelopment()) return Forbid();

            if (!_context.Games.Any())
                return BadRequest("Seed games first!");
            if (!_context.Countries.Any())
                return BadRequest("Seed countries first!");
            if (_context.Teams.Any())
                return BadRequest("Teams already seeded.");

            if (!_context.Organizations.Any())
                return BadRequest("Seed organizations first! Call POST /api/seed/organizations");

            var games = await _context.Games.ToListAsync();
            var countries = await _context.Countries.ToListAsync();
            var orgIds = await _context.Organizations.Select(o => o.Id).ToListAsync();

            var seeder = new TeamSeeder(_pandaScore);
            var teams = await seeder.GenerateAsync(games, countries, orgIds);

            _context.Teams.AddRange(teams);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Teams seeded successfully with real data from PandaScore!",
                count = teams.Count,
                teams = teams.Take(10).Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Tag,
                    Region = t.Region.ToString(),
                    t.LogoUrl
                })
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("players")]
        public async Task<IActionResult> SeedPlayers()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Teams.Any())
                return BadRequest("Seed teams first!");
            if (_context.Players.Any())
                return BadRequest("Players already seeded.");

            var teams = await _context.Teams.ToListAsync();
            var countries = await _context.Countries.ToListAsync();
            var games = await _context.Games.ToListAsync();

            var seeder = new PlayerSeeder(_pandaScore);
            var players = await seeder.GenerateAsync(teams, countries, games);

            _context.Players.AddRange(players);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Players seeded successfully with real data from PandaScore!",
                count = players.Count,
                sample = players.Take(10).Select(p => new
                {
                    p.Id,
                    p.Gamertag,
                    p.RealName,
                    Role = p.Role.ToString(),
                    p.PhotoUrl
                })
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("sponsors")]
        public async Task<IActionResult> SeedSponsors()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (_context.Sponsors.Any())
                return BadRequest("Sponsors already seeded.");

            var seeder = new SponsorSeeder();
            var sponsors = seeder.Generate();

            _context.Sponsors.AddRange(sponsors);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Real sponsors seeded!",
                count = sponsors.Count
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("team-sponsors")]
        public async Task<IActionResult> SeedTeamSponsors()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Teams.Any())
                return BadRequest("Seed teams first!");
            if (!_context.Sponsors.Any())
                return BadRequest("Seed sponsors first!");
            if (_context.TeamSponsors.Any())
                return BadRequest("TeamSponsors already seeded.");

            var teamIds = await _context.Teams.Select(t => t.Id).ToListAsync();
            var sponsorIds = await _context.Sponsors.Select(s => s.Id).ToListAsync();

            var seeder = new TeamSponsorSeeder();
            var links = seeder.Generate(teamIds, sponsorIds);

            _context.TeamSponsors.AddRange(links);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Teams linked to real sponsors!",
                count = links.Count,
                averagePerTeam = links.Count / (double)teamIds.Count
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("tournaments")]
        public async Task<IActionResult> SeedTournaments()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Games.Any())
                return BadRequest("Seed games first!");
            if (_context.Tournaments.Any())
                return BadRequest("Tournaments already seeded.");

            var games = await _context.Games.ToListAsync();

            var seeder = new TournamentSeeder();
            var tournaments = seeder.Generate(games);

            _context.Tournaments.AddRange(tournaments);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Real tournaments seeded!",
                count = tournaments.Count,
                byStatus = tournaments.GroupBy(t => t.Status)
                                      .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("stages")]
        public async Task<IActionResult> SeedStages()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Tournaments.Any())
                return BadRequest("Seed tournaments first!");
            if (_context.Stages.Any())
                return BadRequest("Stages already seeded.");

            var tournaments = await _context.Tournaments.ToListAsync();

            var seeder = new StageSeeder();
            var stages = seeder.Generate(tournaments);

            _context.Stages.AddRange(stages);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Stages seeded! Different per tournament format.",
                count = stages.Count,
                avgPerTournament = stages.Count / (double)tournaments.Count
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("registrations")]
        public async Task<IActionResult> SeedRegistrations()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Tournaments.Any())
                return BadRequest("Seed tournaments first!");
            if (!_context.Teams.Any())
                return BadRequest("Seed teams first!");
            if (_context.TournamentRegistrations.Any())
                return BadRequest("Registrations already seeded.");

            var tournaments = await _context.Tournaments.ToListAsync();
            var teams = await _context.Teams.ToListAsync();

            var seeder = new TournamentRegistrationSeeder();
            var registrations = seeder.Generate(tournaments, teams);

            _context.TournamentRegistrations.AddRange(registrations);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Teams registered for their matching games!",
                count = registrations.Count,
                avgTeamsPerTournament = registrations.Count / (double)tournaments.Count
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("matches")]
        public async Task<IActionResult> SeedMatches()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Stages.Any())
                return BadRequest("Seed stages first!");
            if (!_context.TournamentRegistrations.Any())
                return BadRequest("Seed registrations first!");
            if (_context.Matches.Any())
                return BadRequest("Matches already seeded.");

            var tournaments = await _context.Tournaments.ToListAsync();
            var stages = await _context.Stages.ToListAsync();
            var registrations = await _context.TournamentRegistrations.ToListAsync();
            var games = await _context.Games.ToListAsync();

            var seeder = new MatchSeeder();
            var matches = seeder.Generate(tournaments, stages, registrations, games);

            _context.Matches.AddRange(matches);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Real matchups generated across all tournaments!",
                count = matches.Count,
                played = matches.Count(m => m.WinnerId.HasValue),
                upcoming = matches.Count(m => !m.WinnerId.HasValue)
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("player-stats")]
        public async Task<IActionResult> SeedPlayerStats()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Players.Any())
                return BadRequest("Seed players first!");
            if (!_context.Matches.Any())
                return BadRequest("Seed matches first!");
            if (_context.PlayerStats.Any())
                return BadRequest("PlayerStats already seeded.");

            var players = await _context.Players.ToListAsync();
            var playedMatches = await _context.Matches.Where(m => m.WinnerId != null).ToListAsync();
            var registrations = await _context.TournamentRegistrations.ToListAsync();
            var stages = await _context.Stages.ToListAsync();

            var seeder = new PlayerStatSeeder();
            var stats = seeder.Generate(players, playedMatches, registrations, stages);

            _context.PlayerStats.AddRange(stats);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Smart player stats: age = quantity, salary = quality!",
                count = stats.Count,
                avgPerPlayer = stats.Count / (double)players.Count,
                playersWithStats = stats.Select(s => s.PlayerId).Distinct().Count()
            });
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("achievements")]
        public async Task<IActionResult> SeedAchievements()
        {
            // Allow in dev; in prod, only admins can seed
            if (!_env.IsDevelopment() && !User.Claims.Any(c =>
                c.Type == "https://nexus-esports.com/roles" && c.Value == "admin"))
                return Forbid();

            if (!_context.Players.Any())
                return BadRequest("Seed players first!");
            if (!_context.Tournaments.Any())
                return BadRequest("Seed tournaments first!");
            if (_context.Achievements.Any())
                return BadRequest("Achievements already seeded.");

            var players = await _context.Players.ToListAsync();
            var completedTournaments = await _context.Tournaments
                .Where(t => t.Status == Nexus.Domain.Enums.TournamentStatus.Completed)
                .ToListAsync();

            var seeder = new AchievementSeeder();
            var achievements = seeder.Generate(players, completedTournaments);

            _context.Achievements.AddRange(achievements);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Achievements generated — scaled by age + salary!",
                count = achievements.Count,
                avgPerPlayer = achievements.Count / (double)players.Count
            });
        }
    }
}