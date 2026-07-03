using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class TournamentRegistrationSeeder
    {
        public List<TournamentRegistration> Generate(
            List<Tournament> tournaments,
            List<Team> teams)
        {
            var f = new Faker();
            var registrations = new List<TournamentRegistration>();

            foreach (var tournament in tournaments)
            {
                // Only pick teams that play THIS game
                var eligibleTeams = teams
                    .Where(t => t.GameId == tournament.GameId)
                    .ToList();

                if (eligibleTeams.Count < 4) continue; // need minimum teams

                // 8-16 teams per tournament, depending on how many are available
                var count = Math.Min(f.Random.Int(8, 16), eligibleTeams.Count);

                var picked = eligibleTeams
                    .OrderBy(_ => f.Random.Int())
                    .Take(count)
                    .ToList();

                int seed = 1;
                foreach (var team in picked)
                {
                    registrations.Add(new TournamentRegistration
                    {
                        TeamId = team.Id,
                        TournamentId = tournament.Id,
                        SeedNumber = seed++,
                        RegisteredAt = tournament.StartDate.AddDays(-f.Random.Int(30, 90))
                    });
                }
            }

            return registrations;
        }
    }
}