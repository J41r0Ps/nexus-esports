using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface ICountryRepository
    {
        Task<IEnumerable<Country>> GetCountriesAsync();
    }
}