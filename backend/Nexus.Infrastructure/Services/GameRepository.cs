using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class GameRepository : IGameRepository
    {
        private readonly NexusContext _context;

        public GameRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Game>> GetGamesAsync()
        {
            return await _context.Games
                .OrderBy(g => g.Name)
                .ToListAsync();
        }
    }
}