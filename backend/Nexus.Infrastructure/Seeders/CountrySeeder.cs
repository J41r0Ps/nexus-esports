using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class CountrySeeder
    {
        public List<Country> Generate()
        {
            var faker = new Faker<Country>()
                .CustomInstantiator(f => new Country(
                    f.Address.Country(),
                    f.Address.CountryCode()
                ));

            return faker.Generate(50);
        }
    }
}