using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class StageSeeder
    {
        public List<Stage> Generate(List<int> tournamentIds)
        {
            var stages = new List<Stage>();

            foreach (var tId in tournamentIds)
            {
                stages.Add(new Stage(StageType.GroupStage) { Order = 1, TournamentId = tId }); 
                stages.Add(new Stage(StageType.QuarterFinal) { Order = 2, TournamentId = tId });
                stages.Add(new Stage(StageType.SemiFinal) { Order = 3, TournamentId = tId });
                stages.Add(new Stage(StageType.GrandFinal) { Order = 4, TournamentId = tId });
            }

            return stages;
        }
    }
}