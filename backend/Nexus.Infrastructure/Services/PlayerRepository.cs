using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly NexusContext _context;

        public PlayerRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Player>> GetPlayersAsync(
            string? searchQuery,
            string? role,
            int? teamId,
            int? countryId,
            int pageNumber,
            int pageSize)
        {
            var collection = _context.Players
                .Include(p => p.Team)
                .Include(p => p.Country)
                .AsQueryable();

            // Filter by role
            if (!string.IsNullOrWhiteSpace(role) &&
                Enum.TryParse<PlayerRole>(role, ignoreCase: true, out var roleEnum))
            {
                collection = collection.Where(p => p.Role == roleEnum);
            }

            // Filter by team
            if (teamId.HasValue)
                collection = collection.Where(p => p.TeamId == teamId.Value);

            // Filter by country
            if (countryId.HasValue)
                collection = collection.Where(p => p.CountryId == countryId.Value);

            // Search by gamertag or real name
            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(p =>
                    p.Gamertag.Contains(searchQuery) ||
                    p.RealName.Contains(searchQuery));
            }

            return await collection
                .OrderBy(p => p.Gamertag)
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetPlayerCountAsync(
            string? searchQuery,
            string? role,
            int? teamId,
            int? countryId)
        {
            var collection = _context.Players.AsQueryable();

            if (!string.IsNullOrWhiteSpace(role) &&
                Enum.TryParse<PlayerRole>(role, ignoreCase: true, out var roleEnum))
            {
                collection = collection.Where(p => p.Role == roleEnum);
            }

            if (teamId.HasValue)
                collection = collection.Where(p => p.TeamId == teamId.Value);

            if (countryId.HasValue)
                collection = collection.Where(p => p.CountryId == countryId.Value);

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(p =>
                    p.Gamertag.Contains(searchQuery) ||
                    p.RealName.Contains(searchQuery));
            }

            return await collection.CountAsync();
        }

        public async Task<Player?> GetPlayerAsync(int playerId)
        {
            return await _context.Players
                .Include(p => p.Team)
                .Include(p => p.Country)
                .Include(p => p.PlayerStats)
                .Include(p => p.Achievements)
                .FirstOrDefaultAsync(p => p.Id == playerId);
        }

        public async Task<bool> PlayerExistsAsync(int playerId)
            => await _context.Players.AnyAsync(p => p.Id == playerId);

        public async Task<bool> TeamExistsAsync(int teamId)
            => await _context.Teams.AnyAsync(t => t.Id == teamId);

        public async Task<bool> CountryExistsAsync(int countryId)
            => await _context.Countries.AnyAsync(c => c.Id == countryId);

        public void AddPlayer(Player player) => _context.Players.Add(player);

        public void DeletePlayer(Player player) => _context.Players.Remove(player);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public async Task<bool> HasStatsAsync(int playerId)
            => await _context.PlayerStats.AnyAsync(ps => ps.PlayerId == playerId);

        public async Task<bool> HasAchievementsAsync(int playerId)
            => await _context.Achievements.AnyAsync(a => a.PlayerId == playerId);
    }
}