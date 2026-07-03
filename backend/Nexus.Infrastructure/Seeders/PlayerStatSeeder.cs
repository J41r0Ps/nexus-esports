using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class PlayerStatSeeder
    {
        // Base match cap — 18yo participates in 1 tournament ~50 kills max
        private const int BaseMatchLimit = 1;
        private const int KillCapPerMatch = 50;

        public List<PlayerStat> Generate(
            List<Player> players,
            List<Match> playedMatches,
            List<TournamentRegistration> registrations,
            List<Stage> stages)
        {
            var f = new Faker();
            var stats = new List<PlayerStat>();

            // Map stage → tournament for filtering matches by tournament
            var stageToTournament = stages.ToDictionary(s => s.Id, s => s.TournamentId);

            // Map players by team
            var playersByTeam = players
                .GroupBy(p => p.TeamId)
                .ToDictionary(g => g.Key, g => g.ToList());

            foreach (var player in players)
            {
                var age = DateTime.Now.Year - player.YearOfBirth;

                // ─── QUANTITY ─── based on age
                // 17yo = 0 matches (too young)
                // 18yo = ~1 match limit
                // 19yo = ~2 matches
                // 24yo = ~7 matches
                // 30+ = ~15+ matches
                var yearsSince18 = Math.Max(0, age - 17);
                if (yearsSince18 == 0) continue; // 17 or younger → no stats

                var maxMatchesForPlayer = yearsSince18 * BaseMatchLimit + f.Random.Int(0, 3);

                // Find matches this player's team participated in
                var teamMatches = playedMatches
                    .Where(m => m.Team1Id == player.TeamId || m.Team2Id == player.TeamId)
                    .Where(m => m.WinnerId != null) // only played matches
                    .OrderBy(_ => f.Random.Int())
                    .Take(maxMatchesForPlayer)
                    .ToList();

                // ─── If player's team hasn't played enough matches, guarantee at least 1 ───
                if (teamMatches.Count == 0)
                {
                    // Pick ANY played match as a "guest" appearance (won't happen in reality, but for demo it's fine)
                    var anyMatch = playedMatches.FirstOrDefault(m => m.WinnerId != null);
                    if (anyMatch != null) teamMatches.Add(anyMatch);
                }

                // ─── QUALITY ─── based on salary
                // Salary 30K = 0.06 skill, 500K = 1.0 skill
                var skill = Math.Min(1.0, (double)player.Salary / 500_000);

                foreach (var match in teamMatches)
                {
                    var isWinner = (player.TeamId == match.WinnerId);
                    var winBonus = isWinner ? 1.15 : 0.9;

                    // Kill ceiling scales with age (more matches = more experience per match too)
                    var maxKills = (int)(KillCapPerMatch * (0.5 + skill * 0.5) * winBonus);
                    var kills = f.Random.Int(5, Math.Max(6, maxKills));

                    // Deaths INVERSE to skill:
                    // High salary player = low deaths
                    // Low salary + high age = more deaths (has-been effect)
                    var ageDecayFactor = age >= 28 && skill < 0.4 ? 1.4 : 1.0;
                    var maxDeaths = (int)(30 * (1.2 - skill * 0.7) * ageDecayFactor);
                    var deaths = f.Random.Int(3, Math.Max(4, maxDeaths));

                    var assists = f.Random.Int((int)(3 * skill), (int)(15 * skill) + 3);
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