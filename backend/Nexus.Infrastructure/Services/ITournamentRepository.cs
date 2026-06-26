using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface ITournamentRepository
    {
        Task<IEnumerable<Tournament>> GetTournamentsAsync(
            string? searchQuery,
            string? status,
            string? format,
            int? gameId,
            int pageNumber,
            int pageSize);

        Task<int> GetTournamentCountAsync(
            string? searchQuery,
            string? status,
            string? format,
            int? gameId);

        Task<Tournament?> GetTournamentAsync(int tournamentId);
        Task<bool> TournamentExistsAsync(int tournamentId);
        Task<bool> GameExistsAsync(int gameId);
        Task<bool> HasRegistrationsAsync(int tournamentId);
        void AddTournament(Tournament tournament);
        void DeleteTournament(Tournament tournament);
        Task SaveChangesAsync();
    }
}