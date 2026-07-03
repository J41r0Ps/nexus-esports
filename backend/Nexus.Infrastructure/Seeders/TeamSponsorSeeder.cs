using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class TeamSponsorSeeder
    {
        public List<TeamSponsor> Generate(List<int> teamIds, List<int> sponsorIds)
        {
            var f = new Faker();
            var teamSponsors = new List<TeamSponsor>();

            foreach (var teamId in teamIds)
            {
                // Each team gets 2–5 real sponsors
                var sponsorCount = f.Random.Int(2, 5);
                var picked = sponsorIds
                    .OrderBy(_ => f.Random.Int())
                    .Take(sponsorCount)
                    .ToList();

                foreach (var sponsorId in picked)
                {
                    var start = f.Date.Between(
                        DateTime.Now.AddYears(-3),
                        DateTime.Now.AddYears(-1));

                    // 70% chance the deal is still ongoing (no end date)
                    var isOngoing = f.Random.Bool(0.7f);

                    teamSponsors.Add(new TeamSponsor
                    {
                        TeamId = teamId,
                        SponsorId = sponsorId,
                        StartDate = start,
                        EndDate = isOngoing ? null : start.AddYears(f.Random.Int(1, 2))
                    });
                }
            }

            return teamSponsors;
        }
    }
}