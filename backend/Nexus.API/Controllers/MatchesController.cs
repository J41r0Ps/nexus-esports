using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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

        public MatchesController(IMatchRepository matchRepository, IMapper mapper)
        {
            _matchRepository = matchRepository;
            _mapper = mapper;
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
    }
}