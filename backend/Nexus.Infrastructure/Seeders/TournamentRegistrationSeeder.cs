using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class TournamentRegistrationSeeder
    {
        public List<TournamentRegistration> Generate(
            List<int> teamIds,
            List<int> tournamentIds)
        {
            var registrations = new List<TournamentRegistration>();
            var f = new Faker();

            foreach (var tournamentId in tournamentIds)
            {
                // 6-8 teams per tournament
                var count = f.Random.Int(6, 8);
                var pickedTeams = teamIds
                    .OrderBy(_ => f.Random.Int())
                    .Take(count)
                    .ToList();

                var seed = 1;
                foreach (var teamId in pickedTeams)
                {
                    registrations.Add(new TournamentRegistration
                    {
                        TeamId = teamId,
                        TournamentId = tournamentId,
                        SeedNumber = seed++,
                        RegisteredAt = f.Date.Between(
                            DateTime.Now.AddMonths(-6),
                            DateTime.Now.AddMonths(-1))
                    });
                }
            }

            return registrations;
        }
    }
}