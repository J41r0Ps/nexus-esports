//using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.ExternalServices.PandaScore;

namespace Nexus.Infrastructure.Seeders
{
    // Bogus
    /*    public class PlayerSeeder
    {
        public List<Player> Generate(List<int> teamIds, List<int> countryIds)
        {
            var roles = Enum.GetValues<PlayerRole>().ToList();

            var faker = new Faker<Player>()
                .CustomInstantiator(f => new Player(
                    f.Internet.UserName(),
                    f.Name.FirstName() + " " + f.Name.LastName()
                ))
                .RuleFor(p => p.Role, f => f.PickRandom(roles))
                .RuleFor(p => p.YearOfBirth, f => f.Random.Int(1995, 2005))
                .RuleFor(p => p.Salary, f => f.Random.Decimal(30000, 500000))
                .RuleFor(p => p.TeamId, f => f.PickRandom(teamIds))
                .RuleFor(p => p.CountryId, f => f.PickRandom(countryIds))
                .RuleFor(p => p.PhotoUrl, f => $"https://i.pravatar.cc/150?img={f.Random.Int(1, 70)}");

            return faker.Generate(100);
        }
    }*/
    public class PlayerSeeder
    {
        private readonly IPandaScoreService _pandaScore;

        public PlayerSeeder(IPandaScoreService pandaScore)
        {
            _pandaScore = pandaScore;
        }

        public async Task<List<Player>> GenerateAsync(
            List<Team> teams,
            List<Country> countries,
            List<Game> games)
        {
            var players = new List<Player>();
            var usedGamertags = new HashSet<string>();

            // Build lookup: PandaScoreId → our TeamId
            var teamLookup = teams
                .Where(t => t.PandaScoreId.HasValue)
                .ToDictionary(t => t.PandaScoreId!.Value, t => t.Id);

            foreach (var game in games.Where(g => !string.IsNullOrEmpty(g.PandaScoreSlug)))
            {
                var pandaPlayers = await _pandaScore.GetPlayersByGameAsync(game.PandaScoreSlug!, 100);
                Console.WriteLine($"[Players] {game.Name}: fetched {pandaPlayers.Count}");

                foreach (var pp in pandaPlayers)
                {
                    if (string.IsNullOrWhiteSpace(pp.Name)) continue;
                    if (string.IsNullOrWhiteSpace(pp.ImageUrl)) continue;

                    int ourTeamId;
                    if (pp.CurrentTeam?.Id != null && teamLookup.TryGetValue(pp.CurrentTeam.Id, out var linkedTeamId))
                    {
                        ourTeamId = linkedTeamId;
                    }
                    else
                    {
                        // Player has no current team → assign to random team of same game
                        var teamsOfGame = teams.Where(t => t.GameId == game.Id).ToList();
                        if (teamsOfGame.Count == 0) continue;
                        ourTeamId = teamsOfGame[Random.Shared.Next(teamsOfGame.Count)].Id;
                    }

                    if (usedGamertags.Contains(pp.Name)) continue;
                    usedGamertags.Add(pp.Name);

                    var country = countries.FirstOrDefault(c =>
                        c.Code.Equals(pp.Nationality, StringComparison.OrdinalIgnoreCase));
                    var countryId = country?.Id ?? countries[Random.Shared.Next(countries.Count)].Id;

                    var realName = ($"{pp.FirstName} {pp.LastName}").Trim();
                    if (string.IsNullOrWhiteSpace(realName)) realName = pp.Name;

                    players.Add(new Player(pp.Name, realName)
                    {
                        Role = MapRole(pp.Role),
                        YearOfBirth = ParseYearOfBirth(pp.Birthday),
                        Salary = Random.Shared.Next(50_000, 500_000),
                        PhotoUrl = pp.ImageUrl,
                        TeamId = ourTeamId,
                        CountryId = countryId
                    });
                }

                await Task.Delay(200);
            }

            return players;
        }

        private static int ParseYearOfBirth(string? birthday)
        {
            if (DateTime.TryParse(birthday, out var dt))
                return dt.Year;
            return Random.Shared.Next(1995, 2005);
        }

        private static PlayerRole MapRole(string? role)
        {
            // If PandaScore didn't give us a role, randomize a realistic one
            if (string.IsNullOrWhiteSpace(role))
            {
                var randomRoles = new[]
                {
                    PlayerRole.Fragger, PlayerRole.IGL, PlayerRole.Support,
                    PlayerRole.Sniper,  PlayerRole.Lurker
                };
                return randomRoles[Random.Shared.Next(randomRoles.Length)];
            }

            role = role.ToLower();
            if (role.Contains("igl") || role.Contains("captain")) return PlayerRole.IGL;
            if (role.Contains("support") || role.Contains("healer")) return PlayerRole.Support;
            if (role.Contains("awp") || role.Contains("sniper")) return PlayerRole.Sniper;
            if (role.Contains("lurk") || role.Contains("flex")) return PlayerRole.Lurker;
            if (role.Contains("coach")) return PlayerRole.Coach;
            if (role.Contains("analyst")) return PlayerRole.Analyst;
            if (role.Contains("sub") || role.Contains("substitute")) return PlayerRole.Substitute;
            return PlayerRole.Fragger;
        }
    }
}