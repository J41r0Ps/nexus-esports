using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class StageSeeder
    {
        public List<Stage> Generate(List<int> tournamentIds)
        {
            var stages = new List<Stage>();
            var id = 1;

            foreach (var tId in tournamentIds)
            {
                stages.Add(new Stage(StageType.GroupStage) { Id = id++, Order = 1, TournamentId = tId });
                stages.Add(new Stage(StageType.QuarterFinal) { Id = id++, Order = 2, TournamentId = tId });
                stages.Add(new Stage(StageType.SemiFinal) { Id = id++, Order = 3, TournamentId = tId });
                stages.Add(new Stage(StageType.GrandFinal) { Id = id++, Order = 4, TournamentId = tId });
            }

            return stages;
        }
    }
}