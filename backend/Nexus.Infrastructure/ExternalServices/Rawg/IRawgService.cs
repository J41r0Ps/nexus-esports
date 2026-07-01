using Nexus.Infrastructure.ExternalServices.Rawg.Models;

namespace Nexus.Infrastructure.ExternalServices.Rawg
{
    public interface IRawgService
    {
        Task<RawgGame?> SearchGameByNameAsync(string gameName);
    }
}