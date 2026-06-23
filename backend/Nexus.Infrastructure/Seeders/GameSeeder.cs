using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class GameSeeder
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
    }
}