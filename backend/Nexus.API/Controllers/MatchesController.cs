using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Nexus.API.Hubs;
using Nexus.Contracts.Models;
using Nexus.Infrastructure.Services;

namespace Nexus.API.Controllers
{
    [Route("api/tournaments/{tournamentId}/matches")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchRepository _matchRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<MatchHub> _hubContext;

        public MatchesController(IMatchRepository matchRepository, IMapper mapper, IHubContext<MatchHub> hubContext)
        {
            _matchRepository = matchRepository;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        // GET /api/tournaments/{tournamentId}/matches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchListDto>>> GetMatches(int tournamentId)
        {
            if (!await _matchRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament with Id {tournamentId} not found.");

            var matches = await _matchRepository.GetMatchesByTournamentAsync(tournamentId);
            return Ok(_mapper.Map<IEnumerable<MatchListDto>>(matches));
        }

        // GET /api/tournaments/{tournamentId}/matches/{matchId}
        [HttpGet("{matchId}")]
        public async Task<ActionResult<MatchDetailsDto>> GetMatch(int tournamentId, int matchId)
        {
            if (!await _matchRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament with Id {tournamentId} not found.");

            if (!await _matchRepository.MatchExistsAsync(matchId))
                return NotFound($"Match with Id {matchId} not found.");

            var match = await _matchRepository.GetMatchAsync(matchId);
            return Ok(_mapper.Map<MatchDetailsDto>(match));
        }

        // PATCH /api/tournaments/{tournamentId}/matches/{matchId}
        [HttpPatch("{matchId}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UpdateMatchWinner(
            int tournamentId, int matchId, MatchUpdateDto dto)
        {
            if (!await _matchRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament {tournamentId} not found.");

            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null) return NotFound($"Match {matchId} not found.");

            if (dto.WinnerId != match.Team1Id && dto.WinnerId != match.Team2Id)
                return BadRequest("Winner must be Team1 or Team2 of the match.");

            match.WinnerId = dto.WinnerId;
            await _matchRepository.SaveChangesAsync();

            // Broadcast to all clients in the tournament room
            var fullMatch = await _matchRepository.GetMatchAsync(matchId);
            var matchDto = _mapper.Map<MatchDetailsDto>(fullMatch);

            await _hubContext.Clients
                .Group($"tournament-{tournamentId}")
                .SendAsync("MatchUpdated", matchDto);

            return NoContent();
        }
    }
}