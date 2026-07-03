using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class SponsorSeeder
    {
        public List<Sponsor> Generate()
        {
            var realSponsors = new List<(string Name, SponsorIndustry Industry, decimal ContractValue, string LogoUrl)>
            {
                // Energy drinks — huge in esports
                ("Red Bull",        SponsorIndustry.Energy,     500000m,  "https://img.logo.dev/name/red%20bull?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Monster Energy",  SponsorIndustry.Energy,     450000m,  "https://img.logo.dev/name/Monster%20Energy?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("G FUEL",          SponsorIndustry.Energy,     280000m,  "https://img.logo.dev/name/G%20FUEL?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Hardware
                ("Intel",           SponsorIndustry.Technology, 750000m,  "https://img.logo.dev/name/Intel?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("NVIDIA",          SponsorIndustry.Technology, 700000m,  "https://img.logo.dev/name/NVIDIA?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("AMD",             SponsorIndustry.Technology, 650000m,  "https://img.logo.dev/name/AMD?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Samsung",         SponsorIndustry.Technology, 700000m,  "https://img.logo.dev/name/Samsung?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("ASUS ROG",        SponsorIndustry.Technology, 600000m,  "https://img.logo.dev/name/ASUS%20ROG?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("MSI",             SponsorIndustry.Technology, 400000m,  "https://img.logo.dev/name/MSI?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Peripherals
                ("HyperX",          SponsorIndustry.Gaming,     300000m,  "https://img.logo.dev/name/HyperX?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Logitech G",      SponsorIndustry.Gaming,     320000m,  "https://img.logo.dev/name/Logitech%20G?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Razer",           SponsorIndustry.Gaming,     380000m,  "https://img.logo.dev/name/Razer?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("SteelSeries",     SponsorIndustry.Gaming,     260000m,  "https://img.logo.dev/name/SteelSeries?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Corsair",         SponsorIndustry.Gaming,     290000m,  "https://img.logo.dev/name/Corsair?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Secretlab",       SponsorIndustry.Gaming,     200000m,  "https://img.logo.dev/name/Secretlab?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Apparel
                ("Nike",            SponsorIndustry.Apparel,    400000m,  "https://img.logo.dev/name/Nike?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Adidas",          SponsorIndustry.Apparel,    380000m,  "https://img.logo.dev/name/Adidas?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Puma",            SponsorIndustry.Apparel,    280000m,  "https://img.logo.dev/name/Puma?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Automotive
                ("BMW",             SponsorIndustry.Automotive, 900000m,  "https://img.logo.dev/name/BMW?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Mercedes-Benz",   SponsorIndustry.Automotive, 850000m,  "https://img.logo.dev/name/Mercedes-Benz?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Kia",             SponsorIndustry.Automotive, 500000m,  "https://img.logo.dev/name/Kia?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Finance / Crypto
                ("Visa",            SponsorIndustry.Finance,    800000m,  "https://img.logo.dev/name/Visa?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Mastercard",      SponsorIndustry.Finance,    750000m,  "https://img.logo.dev/name/Mastercard?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Crypto.com",      SponsorIndustry.Finance,    600000m,  "https://img.logo.dev/name/Crypto.com?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Food & Drink
                ("McDonald's",      SponsorIndustry.Food,       250000m,  "https://img.logo.dev/name/McDonald's?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Coca-Cola",       SponsorIndustry.Food,       550000m,  "https://img.logo.dev/name/Coca-Cola?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Pringles",        SponsorIndustry.Food,       180000m,  "https://img.logo.dev/name/Pringles?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                
                // Telecom
                ("AT&T",            SponsorIndustry.Telecommunications, 550000m, "https://img.logo.dev/name/AT&T?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true"),
                ("Verizon",         SponsorIndustry.Telecommunications, 500000m, "https://img.logo.dev/name/Verizon?token=pk_U4mdzWsWQRqBXeUmuJ-xYQ&format=webp&retina=true")
            };

            return realSponsors.Select(s => new Sponsor(s.Name, s.Industry)
            {
                ContractValue = s.ContractValue,
                LogoUrl = s.LogoUrl
            }).ToList();
        }
    }
}