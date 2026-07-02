using Microsoft.Extensions.Configuration;
using Nexus.Infrastructure.ExternalServices.PandaScore.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Nexus.Infrastructure.ExternalServices.PandaScore
{
    public class PandaScoreService : IPandaScoreService
    {
        private readonly HttpClient _http;
        private readonly string _token;
        private readonly string _baseUrl;

        public PandaScoreService(IHttpClientFactory httpFactory, IConfiguration config)
        {
            _http = httpFactory.CreateClient();
            _token = config["ExternalApis:PandaScore:AccessToken"]
                ?? throw new InvalidOperationException("PandaScore token missing.");
            _baseUrl = config["ExternalApis:PandaScore:BaseUrl"]
                ?? "https://api.pandascore.co";
        }

        public async Task<List<PandaScoreTeam>> GetTeamsByGameAsync(string gameSlug, int perPage = 10)
        {
            // e.g. /csgo/teams, /lol/teams, /valorant/teams
            var url = $"{_baseUrl}/{gameSlug}/teams?sort=-modified_at&page[size]={perPage}";

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);

                var response = await _http.SendAsync(request);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[PandaScore /{gameSlug}/teams] {response.StatusCode}: {body}");
                    return new List<PandaScoreTeam>();
                }

                var teams = JsonSerializer.Deserialize<List<PandaScoreTeam>>(body);
                return teams ?? new List<PandaScoreTeam>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PandaScore] Exception: {ex.Message}");
                return new List<PandaScoreTeam>();
            }
        }
        public async Task<List<PandaScorePlayer>> GetPlayersByGameAsync(string gameSlug, int perPage = 100)
        {
            var all = new List<PandaScorePlayer>();
            int page = 1;

            while (true)
            {
                var url = $"{_baseUrl}/{gameSlug}/players?page[size]={perPage}&page[number]={page}";

                try
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, url);
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _token);

                    var response = await _http.SendAsync(request);
                    var body = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"[PandaScore /{gameSlug}/players] {response.StatusCode}: {body}");
                        break;
                    }

                    var batch = JsonSerializer.Deserialize<List<PandaScorePlayer>>(body);
                    if (batch == null || batch.Count == 0) break;

                    all.AddRange(batch);
                    if (batch.Count < perPage) break;   // last page

                    page++;
                    if (page > 5) break;                 // safety cap: max 500 per game
                    await Task.Delay(200);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[PandaScore Players] Exception: {ex.Message}");
                    break;
                }
            }

            return all;
        }
    }
}