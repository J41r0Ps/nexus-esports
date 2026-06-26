using Nexus.Domain.Entities;

namespace Nexus.Infrastructure.Services
{
    public interface IGameRepository
    {
        Task<IEnumerable<Game>> GetGamesAsync();
    }
}