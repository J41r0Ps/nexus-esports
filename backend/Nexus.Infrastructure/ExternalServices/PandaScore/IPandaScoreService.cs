using Nexus.Infrastructure.ExternalServices.PandaScore.Models;

namespace Nexus.Infrastructure.ExternalServices.PandaScore
{
    public interface IPandaScoreService
    {
        Task<List<PandaScoreTeam>> GetTeamsByGameAsync(string gameSlug, int perPage = 10);
        Task<List<PandaScorePlayer>> GetPlayersByTeamAsync(string gameSlug, int teamPandaScoreId);
    }
}