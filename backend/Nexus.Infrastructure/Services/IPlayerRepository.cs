using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface IPlayerRepository
    {
        Task<IEnumerable<Player>> GetPlayersAsync(
            string? searchQuery,
            string? role,
            int? teamId,
            int? countryId,
            int pageNumber,
            int pageSize);

        Task<int> GetPlayerCountAsync(
            string? searchQuery,
            string? role,
            int? teamId,
            int? countryId);

        Task<Player?> GetPlayerAsync(int playerId);
        Task<bool> PlayerExistsAsync(int playerId);
        Task<bool> TeamExistsAsync(int teamId);
        Task<bool> CountryExistsAsync(int countryId);
        void AddPlayer(Player player);
        void DeletePlayer(Player player);
        Task SaveChangesAsync();
        Task<bool> HasStatsAsync(int playerId);
        Task<bool> HasAchievementsAsync(int playerId);
    }
}