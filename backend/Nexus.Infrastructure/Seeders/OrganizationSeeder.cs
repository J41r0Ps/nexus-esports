using Bogus;
using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Seeders
{
    public class OrganizationSeeder
    {
        public List<Organization> Generate()
        {
            var faker = new Faker<Organization>()
                .CustomInstantiator(f => new Organization(
                    f.Company.CompanyName()
                ))
                    .RuleFor(o => o.Website, f => f.Internet.Url())
                    .RuleFor(o => o.FoundedYear, f => f.Random.Int(2000, 2020));

            return faker.Generate(20);
        }
    }
}