using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class PlayerSeeder
    {
        public List<Player> Generate(List<int> teamIds, List<int> countryIds)
        {
            var roles = Enum.GetValues<PlayerRole>().ToList();
            var ids = 1;

            var faker = new Faker<Player>()
                .CustomInstantiator(f => new Player(
                    f.Internet.UserName(),
                    f.Name.FirstName() + " " + f.Name.LastName()
                )
                { Id = ids++ })
                .RuleFor(p => p.Role, f => f.PickRandom(roles))
                .RuleFor(p => p.YearOfBirth, f => f.Random.Int(1995, 2005))
                .RuleFor(p => p.Salary, f => f.Random.Decimal(30000, 500000))
                .RuleFor(p => p.TeamId, f => f.PickRandom(teamIds))
                .RuleFor(p => p.CountryId, f => f.PickRandom(countryIds))
                .RuleFor(p => p.PhotoUrl, (f, p) => $"https://i.pravatar.cc/150?img={p.Id}");

            return faker.Generate(100);
        }
    }
}