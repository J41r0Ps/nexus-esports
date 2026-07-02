using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class OrganizationSeeder
    {
        public List<Organization> Generate()
        {
            var realOrgs = new List<(string Name, string Website, int Founded)>
            {
                ("Team Liquid",             "https://www.teamliquid.com",       2000),
                ("FaZe Clan",               "https://www.fazeclan.com",         2010),
                ("NAVI Group",              "https://navi.gg",                  2009),
                ("G2 Esports",              "https://g2esports.com",            2013),
                ("Cloud9",                  "https://cloud9.gg",                2013),
                ("Fnatic",                  "https://fnatic.com",               2004),
                ("100 Thieves",             "https://100thieves.com",           2017),
                ("TSM",                     "https://tsm.gg",                   2009),
                ("T1 Entertainment",        "https://t1.gg",                    2003),
                ("Gen.G Esports",           "https://geng.gg",                  2017),
                ("Sentinels",               "https://sentinels.gg",             2018),
                ("LOUD",                    "https://loud.gg",                  2019),
                ("Astralis Group",          "https://astralis.gg",              2016),
                ("Team Vitality",           "https://vitality.gg",              2013),
                ("OG Esports",              "https://ogs.gg",                   2015),
                ("Evil Geniuses",           "https://evilgeniuses.gg",          1999),
                ("NRG Esports",             "https://nrg.gg",                   2015),
                ("FURIA Esports",           "https://furia.gg",                 2017),
                ("Paper Rex",               "https://prx.gg",                   2020),
                ("Team Secret",             "https://teamsecret.gg",            2014)
            };

            return realOrgs.Select(o => new Organization(o.Name)
            {
                Website = o.Website,
                FoundedYear = o.Founded
            }).ToList();
        }
    }
}