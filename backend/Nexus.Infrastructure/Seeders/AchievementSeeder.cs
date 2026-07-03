using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class AchievementSeeder
    {
        // Real achievement titles used in esports
        private static readonly string[] TopTierTitles =
        {
            "Tournament Champion", "MVP", "Grand Slam Winner",
            "World Champion", "Regional Champion", "Best Player of the Year"
        };

        private static readonly string[] MidTierTitles =
        {
            "Finalist", "Playoff Hero", "Clutch Master",
            "Ace of the Match", "Rookie of the Year"
        };

        private static readonly string[] LowTierTitles =
        {
            "Rising Star", "Fan Favorite", "Most Improved Player",
            "First Blood King", "Top Scorer of the Split"
        };

        public List<Achievement> Generate(
            List<Player> players,
            List<Tournament> completedTournaments)
        {
            var f = new Faker();
            var achievements = new List<Achievement>();
            var completedIds = completedTournaments.Select(t => t.Id).ToList();

            if (!completedIds.Any()) return achievements;

            foreach (var player in players)
            {
                var age = DateTime.Now.Year - player.YearOfBirth;

                // How many achievements does this player have?
                // Older + higher salary = more achievements
                var ageScore = Math.Max(0, age - 17) / 15.0;               // 17yo=0, 32yo=1
                var salaryScore = Math.Min(1.0, (double)player.Salary / 500_000);
                var totalScore = (ageScore + salaryScore) / 2;                // 0.0 - 1.0

                // Achievement count: 0-8, weighted by score
                var count = (int)(totalScore * 8 + f.Random.Int(-1, 2));
                if (count <= 0) continue;

                // Pick which tier of titles based on salary
                string[] titlePool;
                if (player.Salary >= 300_000) titlePool = TopTierTitles;
                else if (player.Salary >= 150_000) titlePool = MidTierTitles;
                else titlePool = LowTierTitles;

                for (int i = 0; i < count; i++)
                {
                    achievements.Add(new Achievement(f.PickRandom(titlePool))
                    {
                        PlayerId = player.Id,
                        TournamentId = f.PickRandom(completedIds),
                        Date = f.Date.Between(
                            DateTime.Now.AddYears(-Math.Min(age - 17, 5)),
                            DateTime.Now.AddMonths(-1))
                    });
                }
            }

            return achievements;
        }
    }
}