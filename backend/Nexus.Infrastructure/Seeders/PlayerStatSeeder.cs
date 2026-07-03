using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class PlayerStatSeeder
    {
        public List<PlayerStat> Generate(
            List<Player> players,
            List<Match> playedMatches,
            List<TournamentRegistration> registrations)
        {
            var f = new Faker();
            var stats = new List<PlayerStat>();

            // Build map: teamId → playerIds
            var playersByTeam = players
                .GroupBy(p => p.TeamId)
                .ToDictionary(g => g.Key, g => g.ToList());

            foreach (var match in playedMatches)
            {
                // Skill = normalized salary (0.0 - 1.0)
                var team1Players = playersByTeam.TryGetValue(match.Team1Id, out var t1) ? t1 : new();
                var team2Players = playersByTeam.TryGetValue(match.Team2Id, out var t2) ? t2 : new();

                if (!team1Players.Any() || !team2Players.Any()) continue;

                var allInMatch = team1Players.Concat(team2Players).ToList();

                foreach (var player in allInMatch)
                {
                    var isWinner = (player.TeamId == match.WinnerId);

                    // Skill factor: max salary players get 1.0, low salary get ~0.3
                    var skill = Math.Min(1.0, (double)player.Salary / 500_000);

                    // Base ranges scale with skill + winner bonus
                    var winnerBonus = isWinner ? 1.2 : 0.85;

                    var kills = (int)(f.Random.Int(5, 30) * skill * winnerBonus);
                    var deaths = (int)(f.Random.Int(5, 20) * (2 - skill));  // better skill = fewer deaths
                    var assists = (int)(f.Random.Int(2, 15) * skill);
                    var score = (decimal)(kills * 15 + assists * 8 - deaths * 5 + f.Random.Int(0, 50));

                    stats.Add(new PlayerStat
                    {
                        PlayerId = player.Id,
                        MatchId = match.Id,
                        Kills = Math.Max(0, kills),
                        Deaths = Math.Max(0, deaths),
                        Assists = Math.Max(0, assists),
                        Score = Math.Max(0, score)
                    });
                }
            }

            return stats;
        }
    }
}