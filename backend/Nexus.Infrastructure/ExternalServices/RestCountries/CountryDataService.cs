using Microsoft.Extensions.Configuration;
using Nexus.Infrastructure.ExternalServices.RestCountries.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Nexus.Infrastructure.ExternalServices.RestCountries
{
    public class CountryDataService : ICountryDataService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public CountryDataService(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _http = httpFactory.CreateClient();
            _apiKey = config["ExternalApis:RestCountries:ApiKey"]
                ?? throw new InvalidOperationException("RestCountries API Key missing.");
            _baseUrl = config["ExternalApis:RestCountries:BaseUrl"]
                ?? "https://api.restcountries.com";
        }

        public async Task<List<CountryV5>> GetAllCountriesAsync()
        {
            var all = new List<CountryV5>();
            int offset = 0;
            const int limit = 100; // free tier max per request

            while (true)
            {
                var url = $"{_baseUrl}/countries/v5" +
                          $"?response_fields=names.common,codes.alpha_2,flag.url_svg,flag.url_png" +
                          $"&limit={limit}&offset={offset}";

                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

                var response = await _http.SendAsync(request);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[RestCountries] {response.StatusCode}: {body}");
                    break;
                }

                var page = JsonSerializer.Deserialize<CountriesResponseV5>(body);
                var objects = page?.Data?.Objects ?? new List<CountryV5>();

                if (objects.Count == 0) break;

                all.AddRange(objects);
                offset += objects.Count;

                var total = page?.Data?.Meta?.Total ?? 0;
                if (all.Count >= total) break;

                // Small delay to be nice to the API
                await Task.Delay(150);
            }

            Console.WriteLine($"[RestCountries] Fetched {all.Count} countries total");
            return all;
        }
    }
}