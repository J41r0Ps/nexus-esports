using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class TeamSeeder
    {
        public List<Team> Generate(List<int> countryIds, List<int> gameIds, List<int> orgIds)
        {
            var realTeams = new List<(string Name, string Tag, Region Region, int GameOffset)>
            {
                ("Natus Vincere",       "NaVi",     Region.CIS,     0),
                ("FaZe Clan",           "FaZe",     Region.EU,      0),
                ("Team Liquid",         "TL",       Region.NA,      0),
                ("Astralis",            "AST",      Region.EU,      0),
                ("Cloud9",              "C9",       Region.NA,      0),
                ("G2 Esports",          "G2",       Region.EU,      0),
                ("Fnatic",              "FNC",      Region.EU,      0),
                ("Team Vitality",       "VIT",      Region.EU,      0),
                ("100 Thieves",         "100T",     Region.NA,      0),
                ("TSM",                 "TSM",      Region.NA,      1),
                ("T1",                  "T1",       Region.APAC,    1),
                ("Gen.G",               "GEN",      Region.APAC,    1),
                ("Evil Geniuses",       "EG",       Region.NA,      2),
                ("Sentinels",           "SEN",      Region.NA,      2),
                ("LOUD",                "LOUD",     Region.LATAM,   2),
                ("Paper Rex",           "PRX",      Region.APAC,    2),
                ("NRG",                 "NRG",      Region.NA,      3),
                ("OG",                  "OG",       Region.EU,      3),
                ("FURIA",               "FUR",      Region.LATAM,   4),
                ("Team Secret",         "SEC",      Region.EU,      4),
            };

            var f = new Faker();
            return realTeams.Select((t, i) => new Team(t.Name, t.Tag)
            {
                Region = t.Region,
                FoundedYear = f.Random.Int(2012, 2020),
                GameId = gameIds[t.GameOffset % gameIds.Count],
                OrganizationId = f.PickRandom(orgIds),
                CountryId = f.PickRandom(countryIds),
                LogoUrl = $"https://api.dicebear.com/7.x/initials/svg?seed={t.Tag}"
            }).ToList();
        }
    }
}