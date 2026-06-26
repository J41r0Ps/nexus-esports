using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface IMatchRepository
    {
        Task<IEnumerable<Match>> GetMatchesByTournamentAsync(int tournamentId);
        Task<Match?> GetMatchAsync(int matchId);
        Task<bool> MatchExistsAsync(int matchId);
        Task<bool> TournamentExistsAsync(int tournamentId);
    }
}