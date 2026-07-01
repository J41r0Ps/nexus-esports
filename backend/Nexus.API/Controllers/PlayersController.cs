using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.Services;
using System.Text.Json;

namespace Nexus.API.Controllers
{
    [Route("api/players")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IMapper _mapper;
        private const int MaxPageSize = 50;

        public PlayersController(IPlayerRepository playerRepository, IMapper mapper)
        {
            _playerRepository = playerRepository;
            _mapper = mapper;
        }

        // GET /api/players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlayerListDto>>> GetPlayers(
            [FromQuery] string? searchQuery,
            [FromQuery] string? role,
            [FromQuery] int? teamId,
            [FromQuery] int? countryId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            var players = await _playerRepository.GetPlayersAsync(
                searchQuery, role, teamId, countryId, pageNumber, pageSize);

            var totalCount = await _playerRepository.GetPlayerCountAsync(
                searchQuery, role, teamId, countryId);

            Response.Headers.Add("X-Pagination",
                JsonSerializer.Serialize(new PaginationMetadata(totalCount, pageSize, pageNumber)));

            return Ok(_mapper.Map<IEnumerable<PlayerListDto>>(players));
        }

        // GET /api/players/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PlayerDetailsDto>> GetPlayer(int id)
        {
            if (!await _playerRepository.PlayerExistsAsync(id))
                return NotFound();

            var player = await _playerRepository.GetPlayerAsync(id);
            return Ok(_mapper.Map<PlayerDetailsDto>(player));
        }

        // POST /api/players
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<PlayerDetailsDto>> CreatePlayer(
            PlayerForCreationDto playerForCreation)
        {
            if (!await _playerRepository.TeamExistsAsync(playerForCreation.TeamId))
                return BadRequest($"Team with Id {playerForCreation.TeamId} does not exist.");

            if (!await _playerRepository.CountryExistsAsync(playerForCreation.CountryId))
                return BadRequest($"Country with Id {playerForCreation.CountryId} does not exist.");

            var player = _mapper.Map<Player>(playerForCreation);
            _playerRepository.AddPlayer(player);
            await _playerRepository.SaveChangesAsync();

            var playerToReturn = _mapper.Map<PlayerDetailsDto>(player);
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, playerToReturn);
        }

        // PUT /api/players/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UpdatePlayer(int id, PlayerForUpdateDto playerForUpdate)
        {
            if (!await _playerRepository.PlayerExistsAsync(id))
                return NotFound();

            if (!await _playerRepository.TeamExistsAsync(playerForUpdate.TeamId))
                return BadRequest($"Team with Id {playerForUpdate.TeamId} does not exist.");

            if (!await _playerRepository.CountryExistsAsync(playerForUpdate.CountryId))
                return BadRequest($"Country with Id {playerForUpdate.CountryId} does not exist.");

            var player = await _playerRepository.GetPlayerAsync(id);
            _mapper.Map(playerForUpdate, player);
            await _playerRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/players/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeletePlayer(int id)
        {
            if (!await _playerRepository.PlayerExistsAsync(id))
                return NotFound();

            if (await _playerRepository.HasStatsAsync(id))
                return BadRequest("Cannot delete player with match statistics.");

            if (await _playerRepository.HasAchievementsAsync(id))
                return BadRequest("Cannot delete player with achievements.");

            var player = await _playerRepository.GetPlayerAsync(id);
            _playerRepository.DeletePlayer(player!);
            await _playerRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}