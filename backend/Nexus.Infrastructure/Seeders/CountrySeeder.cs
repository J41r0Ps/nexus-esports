using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class CountrySeeder
    {
        public List<Country> Generate()
        {
            var ids = 1;
            var faker = new Faker<Country>()
                .CustomInstantiator(f => new Country(
                    f.Address.Country(),
                    f.Address.CountryCode()
                )
                { Id = ids++ });

            return faker.Generate(50);
        }
    }
}