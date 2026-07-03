using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class StageSeeder
    {
        public List<Stage> Generate(List<Tournament> tournaments)
        {
            var stages = new List<Stage>();

            foreach (var t in tournaments)
            {
                var stageTypes = GetStagesForFormat(t.Format);
                int order = 1;

                foreach (var stageType in stageTypes)
                {
                    stages.Add(new Stage(stageType)
                    {
                        Order = order++,
                        TournamentId = t.Id
                    });
                }
            }

            return stages;
        }

        // Different formats = different stage structures
        private static List<StageType> GetStagesForFormat(TournamentFormat format) => format switch
        {
            TournamentFormat.SingleElimination => new()
            {
                StageType.Qualifier,
                StageType.RoundOf16,
                StageType.QuarterFinal,
                StageType.SemiFinal,
                StageType.GrandFinal
            },
            TournamentFormat.DoubleElimination => new()
            {
                StageType.GroupStage,
                StageType.RoundOf16,
                StageType.QuarterFinal,
                StageType.SemiFinal,
                StageType.GrandFinal
            },
            TournamentFormat.RoundRobin => new()
            {
                StageType.GroupStage,
                StageType.SemiFinal,
                StageType.GrandFinal
            },
            TournamentFormat.Swiss => new()
            {
                StageType.GroupStage,
                StageType.QuarterFinal,
                StageType.SemiFinal,
                StageType.GrandFinal
            },
            TournamentFormat.GSL => new()
            {
                StageType.GroupStage,
                StageType.QuarterFinal,
                StageType.SemiFinal,
                StageType.GrandFinal
            },
            _ => new() { StageType.GroupStage, StageType.GrandFinal }
        };
    }
}