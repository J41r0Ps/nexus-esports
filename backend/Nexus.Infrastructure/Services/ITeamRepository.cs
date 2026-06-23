using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetTeamsAsync(
            string? searchQuery,
            string? region,
            int? gameId,
            int pageNumber,
            int pageSize);

        Task<int> GetTeamCountAsync(
            string? searchQuery,
            string? region,
            int? gameId);

        Task<Team?> GetTeamAsync(int teamId);
        Task<bool> TeamExistsAsync(int teamId);
        Task<bool> GameExistsAsync(int gameId);          
        Task<bool> OrganizationExistsAsync(int orgId);   
        Task<bool> CountryExistsAsync(int countryId);    
        Task<bool> HasPlayersAsync(int teamId);          
        void AddTeam(Team team);
        void DeleteTeam(Team team);
        Task SaveChangesAsync();
    }
}