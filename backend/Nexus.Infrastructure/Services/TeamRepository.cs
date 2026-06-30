using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class TeamRepository : ITeamRepository
    {
        private readonly NexusContext _context;

        public TeamRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Team>> GetTeamsAsync(
            string? searchQuery,
            string? region,
            int? gameId,
            int pageNumber,
            int pageSize)
        {
            var collection = _context.Teams
                .Include(t => t.Game)
                .Include(t => t.Organization)
                .Include(t => t.Country)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(region) &&
                Enum.TryParse<Region>(region, ignoreCase: true, out var regionEnum))
            {
                collection = collection.Where(t => t.Region == regionEnum);
            }

            if (gameId.HasValue)
                collection = collection.Where(t => t.GameId == gameId.Value);

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(t =>
                    t.Name.Contains(searchQuery) ||
                    t.Tag.Contains(searchQuery));
            }

            return await collection
                .OrderBy(t => t.Name)
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .ToListAsync();
        }


        public async Task<int> GetTeamCountAsync(
            string? searchQuery,
            string? region,
            int? gameId)
        {
            var collection = _context.Teams.AsQueryable();

            if (!string.IsNullOrWhiteSpace(region) &&
                Enum.TryParse<Region>(region, ignoreCase: true, out var regionEnum))
            {
                collection = collection.Where(t => t.Region == regionEnum);
            }

            if (gameId.HasValue)
                collection = collection.Where(t => t.GameId == gameId.Value);

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(t =>
                    t.Name.Contains(searchQuery) ||
                    t.Tag.Contains(searchQuery));
            }

            return await collection.CountAsync();
        }


        public async Task<Team?> GetTeamAsync(int teamId)
        {
            return await _context.Teams
                .Include(t => t.Game)
                .Include(t => t.Organization)
                .Include(t => t.Country)
                .Include(t => t.Players)
                .Include(t => t.Sponsors)
                .FirstOrDefaultAsync(t => t.Id == teamId);
        }

        public async Task<bool> TeamExistsAsync(int teamId)
            => await _context.Teams.AnyAsync(t => t.Id == teamId);

        public async Task<bool> GameExistsAsync(int gameId)
            => await _context.Games.AnyAsync(g => g.Id == gameId);

        public async Task<bool> OrganizationExistsAsync(int orgId)
            => await _context.Organizations.AnyAsync(o => o.Id == orgId);

        public async Task<bool> CountryExistsAsync(int countryId)
            => await _context.Countries.AnyAsync(c => c.Id == countryId);

        public async Task<bool> HasPlayersAsync(int teamId)
            => await _context.Players.AnyAsync(p => p.TeamId == teamId);

        public void AddTeam(Team team) => _context.Teams.Add(team);

        public void DeleteTeam(Team team) => _context.Teams.Remove(team);

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        // Team Sponsors
        public async Task<bool> SponsorExistsAsync(int sponsorId)
            => await _context.Sponsors.AnyAsync(s => s.Id == sponsorId);

        public async Task<bool> TeamSponsorExistsAsync(int teamId, int sponsorId)
            => await _context.TeamSponsors.AnyAsync(ts => ts.TeamId == teamId && ts.SponsorId == sponsorId);

        public void AddTeamSponsor(TeamSponsor teamSponsor)
            => _context.TeamSponsors.Add(teamSponsor);

        public async Task<TeamSponsor?> GetTeamSponsorAsync(int teamId, int sponsorId)
            => await _context.TeamSponsors
                .FirstOrDefaultAsync(ts => ts.TeamId == teamId && ts.SponsorId == sponsorId);

        public void RemoveTeamSponsor(TeamSponsor teamSponsor)
            => _context.TeamSponsors.Remove(teamSponsor);
    }
}