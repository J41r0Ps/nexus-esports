using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class TournamentRepository : ITournamentRepository
    {
        private readonly NexusContext _context;

        public TournamentRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tournament>> GetTournamentsAsync(
            string? searchQuery,
            string? status,
            string? format,
            int? gameId,
            int pageNumber,
            int pageSize)
        {
            var collection = _context.Tournaments
                .Include(t => t.Game)
                .Include(t => t.Stages)
                .Include(t => t.TournamentRegistrations)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) &&
                Enum.TryParse<TournamentStatus>(status, ignoreCase: true, out var statusEnum))
                collection = collection.Where(t => t.Status == statusEnum);

            if (!string.IsNullOrWhiteSpace(format) &&
                Enum.TryParse<TournamentFormat>(format, ignoreCase: true, out var formatEnum))
                collection = collection.Where(t => t.Format == formatEnum);

            if (gameId.HasValue)
                collection = collection.Where(t => t.GameId == gameId.Value);

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(t => t.Name.Contains(searchQuery));
            }

            return await collection
                .OrderBy(t => t.StartDate)
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTournamentCountAsync(
            string? searchQuery,
            string? status,
            string? format,
            int? gameId)
        {
            var collection = _context.Tournaments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) &&
                Enum.TryParse<TournamentStatus>(status, ignoreCase: true, out var statusEnum))
                collection = collection.Where(t => t.Status == statusEnum);

            if (!string.IsNullOrWhiteSpace(format) &&
                Enum.TryParse<TournamentFormat>(format, ignoreCase: true, out var formatEnum))
                collection = collection.Where(t => t.Format == formatEnum);

            if (gameId.HasValue)
                collection = collection.Where(t => t.GameId == gameId.Value);

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.Trim();
                collection = collection.Where(t => t.Name.Contains(searchQuery));
            }

            return await collection.CountAsync();
        }

        public async Task<Tournament?> GetTournamentAsync(int tournamentId)
        {
            return await _context.Tournaments
                .Include(t => t.Game)
                .Include(t => t.Stages)
                    .ThenInclude(s => s.Matches)
                .Include(t => t.TournamentRegistrations)
                    .ThenInclude(tr => tr.Team)
                .FirstOrDefaultAsync(t => t.Id == tournamentId);
        }

        public async Task<bool> TournamentExistsAsync(int tournamentId)
            => await _context.Tournaments.AnyAsync(t => t.Id == tournamentId);

        public async Task<bool> GameExistsAsync(int gameId)
            => await _context.Games.AnyAsync(g => g.Id == gameId);

        public async Task<bool> HasRegistrationsAsync(int tournamentId)
            => await _context.TournamentRegistrations.AnyAsync(tr => tr.TournamentId == tournamentId);

        public void AddTournament(Tournament tournament)
            => _context.Tournaments.Add(tournament);

        public void DeleteTournament(Tournament tournament)
            => _context.Tournaments.Remove(tournament);

        public async Task SaveChangesAsync()
            => await _context.SaveChangesAsync();
    }
}