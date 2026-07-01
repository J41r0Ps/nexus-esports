using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.ExternalServices.PandaScore;

namespace Nexus.Infrastructure.Seeders
{
    public class TeamSeeder
    {
        private readonly IPandaScoreService _pandaScore;

        public TeamSeeder(IPandaScoreService pandaScore)
        {
            _pandaScore = pandaScore;
        }

        public async Task<List<Team>> GenerateAsync(
            List<Game> games,
            List<Country> countries,
            List<int> orgIds)
        {
            var teams = new List<Team>();
            var usedNames = new HashSet<string>(); // avoid duplicates across games

            // Only fetch teams for games with a PandaScore slug
            foreach (var game in games.Where(g => !string.IsNullOrEmpty(g.PandaScoreSlug)))
            {
                var pandaTeams = await _pandaScore.GetTeamsByGameAsync(game.PandaScoreSlug!, 10);

                foreach (var pt in pandaTeams)
                {
                    if (string.IsNullOrWhiteSpace(pt.Name)) continue;
                    if (usedNames.Contains(pt.Name)) continue;
                    usedNames.Add(pt.Name);

                    // Match country by 2-letter code (PandaScore returns e.g. "US", "SE")
                    var country = countries.FirstOrDefault(c =>
                        c.Code.Equals(pt.Location, StringComparison.OrdinalIgnoreCase));

                    // If no match, fallback to random country
                    var countryId = country?.Id ?? countries[Random.Shared.Next(countries.Count)].Id;

                    var region = MapCountryCodeToRegion(pt.Location);

                    teams.Add(new Team(pt.Name, pt.Acronym ?? pt.Name[..Math.Min(4, pt.Name.Length)])
                    {
                        LogoUrl = pt.ImageUrl,
                        Region = region,
                        FoundedYear = Random.Shared.Next(2005, 2020),
                        GameId = game.Id,
                        CountryId = countryId,
                        OrganizationId = orgIds[Random.Shared.Next(orgIds.Count)]
                    });
                }

                await Task.Delay(200); // avoid rate limit
            }

            return teams;
        }

        private static Region MapCountryCodeToRegion(string? code)
        {
            if (string.IsNullOrWhiteSpace(code)) return Region.EU;

            var euCodes = new[] { "DE", "FR", "SE", "DK", "PL", "GB", "ES", "PT", "IT", "NL", "BE", "FI", "NO", "CZ" };
            var naCodes = new[] { "US", "CA", "MX" };
            var apacCodes = new[] { "KR", "JP", "CN", "SG", "TH", "VN", "PH", "MY", "ID", "TW", "HK" };
            var cisCodes = new[] { "RU", "UA", "BY", "KZ" };
            var latamCodes = new[] { "BR", "AR", "CL", "PE", "CO" };
            var meCodes = new[] { "AE", "SA", "IL", "TR" };
            var oceCodes = new[] { "AU", "NZ" };

            code = code.ToUpper();
            if (euCodes.Contains(code)) return Region.EU;
            if (naCodes.Contains(code)) return Region.NA;
            if (apacCodes.Contains(code)) return Region.APAC;
            if (cisCodes.Contains(code)) return Region.CIS;
            if (latamCodes.Contains(code)) return Region.LATAM;
            if (meCodes.Contains(code)) return Region.ME;
            if (oceCodes.Contains(code)) return Region.OCE;
            return Region.EU;
        }
    }
}