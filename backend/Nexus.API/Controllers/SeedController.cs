#if DEBUG
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

        [HttpDelete("reset")]
        public async Task<IActionResult> ResetDatabase()
        {
            if (!_env.IsDevelopment()) return Forbid();

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

    /*        [HttpPost("all")]
        public async Task<IActionResult> SeedAll()
        {
            if (!_env.IsDevelopment()) return Forbid();

            if (_context.Countries.Any())
                return BadRequest(new { message = "Database already seeded!" });

            return Ok(new { message = "Seeding disabled — waiting for Part B" });
        }*/

        [HttpPost("games")]
        public async Task<IActionResult> SeedGames()
        {
            if (!_env.IsDevelopment()) return Forbid();

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

        [HttpPost("countries")]
        public async Task<IActionResult> SeedCountries()
        {
            if (!_env.IsDevelopment()) return Forbid();

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

        [HttpPost("organizations")]
        public async Task<IActionResult> SeedOrganizations()
        {
            if (!_env.IsDevelopment()) return Forbid();

            if (_context.Organizations.Any())
                return BadRequest("Organizations already seeded.");

            var seeder = new OrganizationSeeder();
            var orgs = seeder.Generate();

            _context.Organizations.AddRange(orgs);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Real esports orgs seeded!", count = orgs.Count });
        }

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

        [HttpPost("players")]
        public async Task<IActionResult> SeedPlayers()
        {
            if (!_env.IsDevelopment()) return Forbid();

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


        /*        [HttpDelete("players")]
        public async Task<IActionResult> ClearPlayers()
        {
            if (!_env.IsDevelopment()) return Forbid();

            // Delete dependent data first
            _context.PlayerStats.RemoveRange(_context.PlayerStats);
            _context.Achievements.RemoveRange(_context.Achievements);
            _context.Players.RemoveRange(_context.Players);
            await _context.SaveChangesAsync();

            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('PlayerStats', RESEED, 0)");
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Achievements', RESEED, 0)");
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Players', RESEED, 0)");

            return Ok(new { message = "Players (and their stats/achievements) cleared, IDs reset." });
        }*/

    }
}
#endif