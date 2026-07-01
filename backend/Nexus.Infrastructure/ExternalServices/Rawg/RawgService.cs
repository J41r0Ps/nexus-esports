using Microsoft.Extensions.Configuration;
using Nexus.Infrastructure.ExternalServices.Rawg.Models;
using System.Text.Json;

namespace Nexus.Infrastructure.ExternalServices.Rawg
{
    public class RawgService : IRawgService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _baseUrl;

        public RawgService(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _http = httpFactory.CreateClient();
            _apiKey = config["ExternalApis:Rawg:ApiKey"]
                ?? throw new InvalidOperationException("RAWG API Key missing.");
            _baseUrl = config["ExternalApis:Rawg:BaseUrl"]
                ?? "https://api.rawg.io/api";
        }

        public async Task<RawgGame?> SearchGameByNameAsync(string gameName)
        {
            var url = $"{_baseUrl}/games?key={_apiKey}&search={Uri.EscapeDataString(gameName)}&page_size=1";

            try
            {
                var response = await _http.GetAsync(url);
                if (!response.IsSuccessStatusCode) return null;

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<RawgSearchResponse>(json);

                return result?.Results?.FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }
    }
}