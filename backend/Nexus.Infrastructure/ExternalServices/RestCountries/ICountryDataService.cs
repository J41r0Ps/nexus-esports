using Nexus.Infrastructure.ExternalServices.RestCountries.Models;

namespace Nexus.Infrastructure.ExternalServices.RestCountries
{
    public interface ICountryDataService
    {
        Task<List<CountryV5>> GetAllCountriesAsync();
    }
}