using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class MatchRepository : IMatchRepository
    {
        private readonly NexusContext _context;

        public MatchRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Match>> GetMatchesByTournamentAsync(int tournamentId)
        {
            return await _context.Matches
                .Include(m => m.Team1)
                .Include(m => m.Team2)
                .Include(m => m.Stage)
                .Where(m => m.Stage.TournamentId == tournamentId)
                .OrderBy(m => m.MatchDate)
                .ToListAsync();
        }

        public async Task<Match?> GetMatchAsync(int matchId)
        {
            return await _context.Matches
                .Include(m => m.Team1)
                .Include(m => m.Team2)
                .Include(m => m.Stage)
                .Include(m => m.PlayerStats)
                    .ThenInclude(ps => ps.Player)
                .FirstOrDefaultAsync(m => m.Id == matchId);
        }

        public async Task<bool> MatchExistsAsync(int matchId)
            => await _context.Matches.AnyAsync(m => m.Id == matchId);

        public async Task<bool> TournamentExistsAsync(int tournamentId)
            => await _context.Tournaments.AnyAsync(t => t.Id == tournamentId);
    }
}