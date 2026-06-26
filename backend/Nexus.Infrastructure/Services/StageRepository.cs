using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class StageRepository : IStageRepository
    {
        private readonly NexusContext _context;

        public StageRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Stage>> GetStagesByTournamentAsync(int tournamentId)
        {
            return await _context.Stages
                .Include(s => s.Matches)
                    .ThenInclude(m => m.Team1)
                .Include(s => s.Matches)
                    .ThenInclude(m => m.Team2)
                .Where(s => s.TournamentId == tournamentId)
                .OrderBy(s => s.Order)
                .ToListAsync();
        }

        public async Task<Stage?> GetStageAsync(int stageId)
        {
            return await _context.Stages
                .Include(s => s.Matches)
                    .ThenInclude(m => m.Team1)
                .Include(s => s.Matches)
                    .ThenInclude(m => m.Team2)
                .Include(s => s.Matches)
                    .ThenInclude(m => m.PlayerStats)
                        .ThenInclude(ps => ps.Player)
                .FirstOrDefaultAsync(s => s.Id == stageId);
        }

        public async Task<bool> StageExistsAsync(int stageId)
            => await _context.Stages.AnyAsync(s => s.Id == stageId);

        public async Task<bool> TournamentExistsAsync(int tournamentId)
            => await _context.Tournaments.AnyAsync(t => t.Id == tournamentId);
    }
}