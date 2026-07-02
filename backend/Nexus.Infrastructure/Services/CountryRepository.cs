using Microsoft.EntityFrameworkCore;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.DbContexts;

namespace Nexus.Infrastructure.Services
{
    public class CountryRepository : ICountryRepository
    {
        private readonly NexusContext _context;

        public CountryRepository(NexusContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return await _context.Countries
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Country>> GetCountriesWithPlayersAsync()
        {
            return await _context.Countries
                .Where(c => c.Players.Any())
                .OrderBy(c => c.Name)
                .ToListAsync();
        }
    }
}