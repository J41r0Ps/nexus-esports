using Nexus.Domain.Entities;
using Nexus.Infrastructure.ExternalServices.RestCountries;

namespace Nexus.Infrastructure.Seeders
{
    public class CountrySeeder
    {
        private readonly ICountryDataService _countryApi;

        public CountrySeeder(ICountryDataService countryApi)
        {
            _countryApi = countryApi;
        }

        public async Task<List<Country>> GenerateAsync()
        {
            var apiCountries = await _countryApi.GetAllCountriesAsync();

            return apiCountries
                .Where(c =>
                    !string.IsNullOrWhiteSpace(c.Names?.Common) &&
                    !string.IsNullOrWhiteSpace(c.Codes?.Alpha2))
                .OrderBy(c => c.Names!.Common)
                .Select(c => new Country(c.Names!.Common, c.Codes!.Alpha2!)
                {
                    FlagUrl = c.Flag?.UrlSvg ?? c.Flag?.UrlPng
                })
                .ToList();
        }
    }
}