using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class SponsorSeeder
    {
        public List<Sponsor> Generate()
        {
            var realSponsors = new List<(string Name, SponsorIndustry Industry, decimal Value)>
            {
                ("Red Bull",        SponsorIndustry.Energy,          500000m),
                ("Intel",           SponsorIndustry.Technology,      750000m),
                ("ASUS ROG",        SponsorIndustry.Technology,      600000m),
                ("Monster Energy",  SponsorIndustry.Energy,          450000m),
                ("HyperX",          SponsorIndustry.Technology,      300000m),
                ("BMW",             SponsorIndustry.Automotive,      900000m),
                ("Nike",            SponsorIndustry.Apparel,         400000m),
                ("Adidas",          SponsorIndustry.Apparel,         350000m),
                ("Visa",            SponsorIndustry.Finance,         800000m),
                ("McDonald's",      SponsorIndustry.Food,            250000m),
                ("Samsung",         SponsorIndustry.Technology,      700000m),
                ("Logitech",        SponsorIndustry.Technology,      320000m),
                ("AT&T",            SponsorIndustry.Telecommunications, 550000m),
                ("Secretlab",       SponsorIndustry.Gaming,          200000m),
                ("Razer",           SponsorIndustry.Gaming,          280000m),
            };

            return realSponsors.Select((s, i) => new Sponsor(s.Name, s.Industry)
            {
                Id = i + 1,
                ContractValue = s.Value,
                LogoUrl = $"https://logo.clearbit.com/{s.Name.ToLower().Replace(" ", "").Replace("'", "")}.com"
            }).ToList();
        }
    }
}