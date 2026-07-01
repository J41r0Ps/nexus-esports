//using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;
using Nexus.Infrastructure.ExternalServices.Rawg;

namespace Nexus.Infrastructure.Seeders
{
    // Old version with Bogus
    /*    public class GameSeeder
        {
            public List<Game> Generate()
            {
                var realGames = new List<(string Name, GameGenre Genre, string Publisher, string Cover)>
    {
        ("Counter-Strike 2", GameGenre.FPS, "Valve",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"),

        ("League of Legends", GameGenre.MOBA, "Riot Games",
            "https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-47eb328eac5ddd63ebd096ded7d0d5ab"),

        ("Valorant", GameGenre.FPS, "Riot Games",
         "https://assets.xboxservices.com/assets/4e/bc/4ebcb533-e184-42f3-833b-9aa47a81f39e.jpg?n=153142244433_Poster-Image-1084_1920x720.jpg"),

        ("Dota 2", GameGenre.MOBA, "Valve",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg"),

        ("Fortnite", GameGenre.BattleRoyale, "Epic Games",
         "https://gaming-cdn.com/images/news/articles/12370/cover/fortnite-is-set-to-make-a-comeback-on-ios-in-the-u-s-cover681e54c510a34.jpg"),

        ("Apex Legends", GameGenre.BattleRoyale, "Electronic Arts",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg"),

        ("StarCraft II", GameGenre.RTS, "Blizzard",
            "https://store-images.s-microsoft.com/image/apps.11562.14124222480596136.ed20a9aa-83ad-4957-99bb-a6b44ee47223.966f09b0-5e8c-47d6-ada0-7714b0cb26e8?q=90&w=480&h=270"),

        ("Street Fighter 6", GameGenre.Fighting, "Capcom",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg"),

        ("Rocket League", GameGenre.Sports, "Psyonix",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg"),

        ("Hearthstone", GameGenre.CardGame, "Blizzard",
            "https://d39zum0jwvcigt.cloudfront.net/_next/static/images/default-4fff3c606c794dc03a915b9071f562d3.jpg"),
    };

                return realGames.Select((g, i) => new Game(g.Name, g.Genre, g.Publisher)
                {
                    CoverImageUrl = g.Cover
                }).ToList();
            }
        }*/

    public class GameSeeder
    {
        private readonly IRawgService _rawg;

        public GameSeeder(IRawgService rawg)
        {
            _rawg = rawg;
        }

        public async Task<List<Game>> GenerateAsync()
        {
            // Curated esports games — name + our enum genre + fallback publisher
            var esportsGames = new List<(string Name, GameGenre Genre, string FallbackPublisher, string? PandaSlug)>
            {
                ("Counter-Strike 2",             GameGenre.FPS,          "Valve",             "csgo"),
                ("League of Legends",            GameGenre.MOBA,         "Riot Games",        "lol"),
                ("Valorant",                     GameGenre.FPS,          "Riot Games",        "valorant"),
                ("Dota 2",                       GameGenre.MOBA,         "Valve",             "dota2"),
                ("Fortnite",                     GameGenre.BattleRoyale, "Epic Games",        null),
                ("Apex Legends",                 GameGenre.BattleRoyale, "Electronic Arts",   null),
                ("Rainbow Six Siege",            GameGenre.FPS,          "Ubisoft",           "r6siege"),
                ("Overwatch 2",                  GameGenre.FPS,          "Blizzard Entertainment", "ow"),
                ("Rocket League",                GameGenre.Sports,       "Psyonix",           "rl"),
                ("StarCraft II",                 GameGenre.RTS,          "Blizzard Entertainment", "starcraft-2"),
                ("Street Fighter 6",             GameGenre.Fighting,     "Capcom",            null),
                ("Hearthstone",                  GameGenre.CardGame,     "Blizzard Entertainment", null),
                ("Call of Duty: Modern Warfare III", GameGenre.FPS,      "Activision",        "codmw"),
                ("Mobile Legends: Bang Bang",    GameGenre.MOBA,         "Moonton",           "mlbb"),
                ("PUBG: BATTLEGROUNDS",          GameGenre.BattleRoyale, "KRAFTON",           "pubg")
            };
            var games = new List<Game>();

            foreach (var (name, genre, fallbackPublisher, slug) in esportsGames)
            {
                // Try to enrich from RAWG
                var rawgGame = await _rawg.SearchGameByNameAsync(name);
                var publisher = rawgGame?.Publishers?.FirstOrDefault()?.Name ?? fallbackPublisher;
                var coverUrl = rawgGame?.BackgroundImage;

                games.Add(new Game(name, genre, publisher)
                {
                    CoverImageUrl = coverUrl,
                    PandaScoreSlug = slug
                });

                // Small delay so RAWG doesn't rate-limit us (20K/month is plenty though)
                await Task.Delay(100);
            }

            return games;
        }
    }
}