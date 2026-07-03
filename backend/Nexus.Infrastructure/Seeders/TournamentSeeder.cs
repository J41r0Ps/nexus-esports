using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class TournamentSeeder
    {
        // Real esports tournaments per game
        private static readonly Dictionary<string, List<(string Name, decimal Prize, TournamentFormat Format)>> RealTournaments
            = new()
            {
                ["Counter-Strike 2"] = new()
                {
                    ("IEM Katowice 2025",            1_250_000m, TournamentFormat.SingleElimination),
                    ("ESL Pro League Season 21",       850_000m, TournamentFormat.RoundRobin),
                    ("BLAST Premier Spring Final",     425_000m, TournamentFormat.GSL),
                    ("IEM Cologne 2025",             1_000_000m, TournamentFormat.SingleElimination),
                    ("PGL Major Copenhagen",         1_250_000m, TournamentFormat.Swiss),
                },
                ["League of Legends"] = new()
                {
                    ("Worlds 2025",                  2_500_000m, TournamentFormat.DoubleElimination),
                    ("MSI 2025",                     2_000_000m, TournamentFormat.DoubleElimination),
                    ("LEC Summer Split 2025",          500_000m, TournamentFormat.RoundRobin),
                    ("LCS Championship 2025",          400_000m, TournamentFormat.DoubleElimination),
                    ("LCK Spring 2025",                600_000m, TournamentFormat.RoundRobin),
                },
                ["Valorant"] = new()
                {
                    ("VCT Champions 2025",           2_250_000m, TournamentFormat.DoubleElimination),
                    ("VCT Masters Madrid",           1_000_000m, TournamentFormat.DoubleElimination),
                    ("VCT Americas League",            250_000m, TournamentFormat.RoundRobin),
                    ("VCT Pacific Kickoff",            200_000m, TournamentFormat.Swiss),
                },
                ["Dota 2"] = new()
                {
                    ("The International 2025",      40_000_000m, TournamentFormat.DoubleElimination),
                    ("ESL One Birmingham",             850_000m, TournamentFormat.DoubleElimination),
                    ("DreamLeague Season 24",          500_000m, TournamentFormat.Swiss),
                    ("BetBoom Dacha Belgrade",         300_000m, TournamentFormat.GSL),
                },
                ["Rocket League"] = new()
                {
                    ("RLCS 2025 World Championship",   500_000m, TournamentFormat.Swiss),
                    ("RLCS Major Copenhagen",          300_000m, TournamentFormat.SingleElimination),
                },
                ["Overwatch 2"] = new()
                {
                    ("Overwatch Champions Series",     500_000m, TournamentFormat.DoubleElimination),
                    ("OWCS Major Stockholm",           250_000m, TournamentFormat.GSL),
                },
                ["Rainbow Six Siege"] = new()
                {
                    ("Six Invitational 2025",          750_000m, TournamentFormat.DoubleElimination),
                    ("BLAST R6 Major Manchester",      500_000m, TournamentFormat.SingleElimination),
                },
                ["StarCraft II"] = new()
                {
                    ("IEM Katowice StarCraft II",      200_000m, TournamentFormat.SingleElimination),
                    ("ESL SC2 Masters Winter",         150_000m, TournamentFormat.GSL),
                }
            };

        public List<Tournament> Generate(List<Game> games)
        {
            var f = new Faker();
            var tournaments = new List<Tournament>();

            foreach (var game in games)
            {
                if (!RealTournaments.TryGetValue(game.Name, out var events)) continue;

                foreach (var (name, prize, format) in events)
                {
                    // Realistic status distribution:
                    // 40% Completed (past), 20% Ongoing, 40% Upcoming
                    var roll = f.Random.Double();
                    TournamentStatus status;
                    DateTime startDate;
                    DateTime endDate;

                    if (roll < 0.4)
                    {
                        // Past tournament
                        status = TournamentStatus.Completed;
                        startDate = f.Date.Between(DateTime.Now.AddYears(-1), DateTime.Now.AddMonths(-2));
                        endDate = startDate.AddDays(f.Random.Int(7, 21));
                    }
                    else if (roll < 0.6)
                    {
                        // Currently running
                        status = TournamentStatus.Ongoing;
                        startDate = DateTime.Now.AddDays(-f.Random.Int(1, 5));
                        endDate = DateTime.Now.AddDays(f.Random.Int(2, 10));
                    }
                    else
                    {
                        // Upcoming
                        status = TournamentStatus.Upcoming;
                        startDate = DateTime.Now.AddDays(f.Random.Int(14, 180));
                        endDate = startDate.AddDays(f.Random.Int(7, 21));
                    }

                    tournaments.Add(new Tournament(name)
                    {
                        PrizePool = prize,
                        Status = status,
                        Format = format,
                        StartDate = startDate,
                        EndDate = endDate,
                        GameId = game.Id
                    });
                }
            }

            return tournaments;
        }
    }
}