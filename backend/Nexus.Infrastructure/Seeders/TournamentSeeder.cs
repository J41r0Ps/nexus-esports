using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class TournamentSeeder
    {
        public List<Tournament> Generate(List<int> gameIds)
        {
            var realTournaments = new List<(string Name, decimal Prize, TournamentStatus Status, TournamentFormat Format)>
            {
                ("IEM Katowice 2025",           1000000m,   TournamentStatus.Completed,  TournamentFormat.SingleElimination),
                ("ESL Pro League Season 20",    750000m,    TournamentStatus.Completed,  TournamentFormat.RoundRobin),
                ("BLAST Premier Spring 2025",   425000m,    TournamentStatus.Completed,  TournamentFormat.GSL),
                ("IEM Cologne 2025",            1000000m,   TournamentStatus.Ongoing,    TournamentFormat.SingleElimination),
                ("PGL Major Copenhagen",        1250000m,   TournamentStatus.Upcoming,   TournamentFormat.Swiss),
                ("Worlds 2025",                 2000000m,   TournamentStatus.Upcoming,   TournamentFormat.DoubleElimination),
                ("VCT Champions 2025",          1000000m,   TournamentStatus.Ongoing,    TournamentFormat.SingleElimination),
                ("The International 2025",      40000000m,  TournamentStatus.Upcoming,   TournamentFormat.DoubleElimination),
                ("EVO 2025",                    100000m,    TournamentStatus.Upcoming,   TournamentFormat.SingleElimination),
                ("RLCS 2025 World Championship",500000m,    TournamentStatus.Completed,  TournamentFormat.Swiss),
            };

            var f = new Faker();
            return realTournaments.Select((t, i) =>
            {
                var start = f.Date.Between(DateTime.Now.AddMonths(-6), DateTime.Now.AddMonths(6));
                return new Tournament(t.Name)
                {
                    Id = i + 1,
                    PrizePool = t.Prize,
                    Status = t.Status,
                    Format = t.Format,
                    StartDate = start,
                    EndDate = start.AddDays(f.Random.Int(3, 14)),
                    GameId = f.PickRandom(gameIds)
                };
            }).ToList();
        }
    }
}