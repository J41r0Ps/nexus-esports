using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts.Models;
using Nexus.Infrastructure.Services;

namespace Nexus.API.Controllers
{
    [Route("api/games")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IGameRepository _gameRepository;
        private readonly IMapper _mapper;

        public GamesController(IGameRepository gameRepository, IMapper mapper)
        {
            _gameRepository = gameRepository;
            _mapper = mapper;
        }

        // GET /api/games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameListDto>>> GetGames()
        {
            var games = await _gameRepository.GetGamesAsync();
            return Ok(_mapper.Map<IEnumerable<GameListDto>>(games));
        }
    }
}