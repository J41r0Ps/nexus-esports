using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class MatchSeeder
    {
        public List<Match> Generate(List<int> stageIds, List<int> teamIds)
        {
            var ids = 1;
            var f = new Faker();
            var matches = new List<Match>();

            foreach (var stageId in stageIds)
            {
                for (int i = 0; i < 4; i++)
                {
                    var shuffled = teamIds.OrderBy(_ => f.Random.Int()).ToList();
                    var team1 = shuffled[0];
                    var team2 = shuffled[1];

                    matches.Add(new Match(f.Date.Between(DateTime.Now.AddMonths(-3), DateTime.Now.AddMonths(3)))
                    {
                        Id = ids++,
                        StageId = stageId,
                        Team1Id = team1,
                        Team2Id = team2,
                        WinnerId = f.Random.Bool() ? team1 : team2,
                        StreamUrl = $"https://twitch.tv/esl_csgo"
                    });
                }
            }

            return matches;
        }
    }
}