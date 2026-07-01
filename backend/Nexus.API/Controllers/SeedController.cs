#if DEBUG
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nexus.Infrastructure.DbContexts;
using Nexus.Infrastructure.Seeders;

namespace Nexus.API.Controllers
{
    [Route("api/seed")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly NexusContext _context;
        private readonly IWebHostEnvironment _env;

        public SeedController(NexusContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // Bogus "not more used"
        /*        [HttpPost("all")]
                public async Task<IActionResult> SeedAll()
                {
                    if (!_env.IsDevelopment()) return Forbid();

                    // ← Guard: only seed if DB is empty
                    if (_context.Countries.Any())
                        return BadRequest(new { message = "Database already seeded!" });

                    // Step 1: Base data
                    var countries = new CountrySeeder().Generate();
                    var organizations = new OrganizationSeeder().Generate();
                    var games = new GameSeeder().Generate();
                    var sponsors = new SponsorSeeder().Generate();

                    _context.Countries.AddRange(countries);
                    _context.Organizations.AddRange(organizations);
                    _context.Games.AddRange(games);
                    _context.Sponsors.AddRange(sponsors);
                    await _context.SaveChangesAsync();

                    // Step 2: Teams
                    var countryIds = countries.Select(c => c.Id).ToList();
                    var gameIds = games.Select(g => g.Id).ToList();
                    var orgIds = organizations.Select(o => o.Id).ToList();
                    var sponsorIds = sponsors.Select(s => s.Id).ToList();

                    var teams = new TeamSeeder().Generate(countryIds, gameIds, orgIds);
                    _context.Teams.AddRange(teams);
                    await _context.SaveChangesAsync();

                    // Step 3: Players + TeamSponsors
                    var teamIds = teams.Select(t => t.Id).ToList();

                    var players = new PlayerSeeder().Generate(teamIds, countryIds);
                    var teamSponsors = new TeamSponsorSeeder().Generate(teamIds, sponsorIds);

                    _context.Players.AddRange(players);
                    _context.TeamSponsors.AddRange(teamSponsors);
                    await _context.SaveChangesAsync();

                    // Step 4: Tournaments + Stages
                    var tournaments = new TournamentSeeder().Generate(gameIds);
                    _context.Tournaments.AddRange(tournaments);
                    await _context.SaveChangesAsync();

                    var tournamentIds = tournaments.Select(t => t.Id).ToList();
                    var stages = new StageSeeder().Generate(tournamentIds);
                    _context.Stages.AddRange(stages);
                    await _context.SaveChangesAsync();

                    // Step 5: Matches
                    var stageIds = stages.Select(s => s.Id).ToList();
                    var matches = new MatchSeeder().Generate(stageIds, teamIds);
                    _context.Matches.AddRange(matches);
                    await _context.SaveChangesAsync();

                    // Step 6: Tournament Registrations 
                    var registrations = new TournamentRegistrationSeeder()
                        .Generate(teamIds, tournamentIds);
                    _context.TournamentRegistrations.AddRange(registrations);
                    await _context.SaveChangesAsync();

                    // Step 7: Player Stats
                    var matchIds = matches.Select(m => m.Id).ToList();
                    var playerIds = players.Select(p => p.Id).ToList();
                    var f = new Bogus.Faker();
                    var playerStats = new List<Nexus.Domain.Entities.PlayerStat>();

                    foreach (var match in matches.Take(50))
                    {
                        var picked = playerIds.OrderBy(_ => f.Random.Int()).Take(10).ToList();
                        foreach (var pid in picked)
                        {
                            playerStats.Add(new Nexus.Domain.Entities.PlayerStat
                            {
                                PlayerId = pid,
                                MatchId = match.Id,
                                Kills = f.Random.Int(0, 35),
                                Deaths = f.Random.Int(0, 25),
                                Assists = f.Random.Int(0, 20),
                                Score = f.Random.Decimal(50, 250)
                            });
                        }
                    }
                    _context.PlayerStats.AddRange(playerStats);
                    await _context.SaveChangesAsync();

                    // Step 8: Achievements
                    var achievements = new List<Nexus.Domain.Entities.Achievement>();
                    var titles = new[] { "MVP", "Tournament Winner", "Best Player", "Rookie of the Year", "Clutch Master" };
                    foreach (var pid in playerIds.OrderBy(_ => f.Random.Int()).Take(40))
                    {
                        achievements.Add(new Nexus.Domain.Entities.Achievement(f.PickRandom(titles))
                        {
                            PlayerId = pid,
                            TournamentId = f.PickRandom(tournamentIds),
                            Date = f.Date.Between(DateTime.Now.AddYears(-2), DateTime.Now)
                        });
                    }
                    _context.Achievements.AddRange(achievements);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "Database seeded successfully!",
                        countries = countries.Count,
                        organizations = organizations.Count,
                        games = games.Count,
                        sponsors = sponsors.Count,
                        teams = teams.Count,
                        players = players.Count,
                        teamSponsors = teamSponsors.Count,
                        tournaments = tournaments.Count,
                        stages = stages.Count,
                        matches = matches.Count,
                        tournamentRegistrations = registrations.Count,
                        playerStats = playerStats.Count,
                        achievements = achievements.Count,
                    });
                }*/

        [HttpPost("all")]
        public async Task<IActionResult> SeedAll()
        {
            if (!_env.IsDevelopment()) return Forbid();

            if (_context.Countries.Any())
                return BadRequest(new { message = "Database already seeded!" });

            return Ok(new { message = "Seeding disabled — waiting for Part B" });
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
    }
}
#endif