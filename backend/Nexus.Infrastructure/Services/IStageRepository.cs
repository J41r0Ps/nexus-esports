using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface IStageRepository
    {
        Task<IEnumerable<Stage>> GetStagesByTournamentAsync(int tournamentId);
        Task<Stage?> GetStageAsync(int stageId);
        Task<bool> StageExistsAsync(int stageId);
        Task<bool> TournamentExistsAsync(int tournamentId);
    }
}