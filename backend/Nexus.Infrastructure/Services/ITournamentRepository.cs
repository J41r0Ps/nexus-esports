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

        // Tournament Registration
        Task<bool> TeamExistsAsync(int teamId);
        Task<bool> IsTeamRegisteredAsync(int tournamentId, int teamId);
        Task<IEnumerable<TournamentRegistration>> GetRegistrationsAsync(int tournamentId);
        void AddRegistration(TournamentRegistration registration);
        Task<TournamentRegistration?> GetRegistrationAsync(int tournamentId, int teamId);
        void RemoveRegistration(TournamentRegistration registration);
    }
}