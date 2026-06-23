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
                ("Counter-Strike 2",GameGenre.FPS,"Valve","https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"),
                ("League of Legends",GameGenre.MOBA,"Riot Games","https://cdn.cloudflare.steamstatic.com/steam/apps/2801540/header.jpg"),
                ("Valorant",GameGenre.FPS,"Riot Games","https://cdn2.unrealengine.com/valorant-header-1920x1080-1920x1080-c4b4b8a3b7d5.jpg"),
                ("Dota 2",GameGenre.MOBA,"Valve","https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg"),
                ("Fortnite",GameGenre.BattleRoyale, "Epic Games","https://cdn2.unrealengine.com/fortnite-chapter-4-header-1920x1080-1920x1080.jpg"),
                ("Apex Legends",GameGenre.BattleRoyale, "Electronic Arts","https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg"),
                ("StarCraft II",GameGenre.RTS,"Blizzard","https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg"),
                ("Street Fighter 6",GameGenre.Fighting,"Capcom","https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg"),
                ("Rocket League",GameGenre.Sports,"Psyonix","https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg"),
                ("Hearthstone",GameGenre.CardGame,"Blizzard","https://cdn.cloudflare.steamstatic.com/steam/apps/1069190/header.jpg"),
            };

            return realGames.Select((g, i) => new Game(g.Name, g.Genre, g.Publisher)
            {
                Id = i + 1,
                CoverImageUrl = g.Cover
            }).ToList();
        }
    }
}