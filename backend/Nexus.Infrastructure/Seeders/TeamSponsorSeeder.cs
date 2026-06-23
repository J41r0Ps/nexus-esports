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
                var count = f.Random.Int(1, 4);
                var picked = sponsorIds.OrderBy(_ => f.Random.Int()).Take(count).ToList();

                foreach (var sponsorId in picked)
                {
                    var start = f.Date.Between(DateTime.Now.AddYears(-3), DateTime.Now.AddYears(-1));
                    teamSponsors.Add(new TeamSponsor
                    {
                        TeamId = teamId,
                        SponsorId = sponsorId,
                        StartDate = start,
                        EndDate = f.Random.Bool() ? start.AddYears(1) : null
                    });
                }
            }

            return teamSponsors;
        }
    }
}