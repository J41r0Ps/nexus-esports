using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts.Models;
using Nexus.Infrastructure.Services;

namespace Nexus.API.Controllers
{
    [Route("api/tournaments/{tournamentId}/stages")]
    [ApiController]
    public class StagesController : ControllerBase
    {
        private readonly IStageRepository _stageRepository;
        private readonly IMapper _mapper;

        public StagesController(IStageRepository stageRepository, IMapper mapper)
        {
            _stageRepository = stageRepository;
            _mapper = mapper;
        }

        // GET /api/tournaments/{tournamentId}/stages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StageListDto>>> GetStages(int tournamentId)
        {
            if (!await _stageRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament with Id {tournamentId} not found.");

            var stages = await _stageRepository.GetStagesByTournamentAsync(tournamentId);
            return Ok(_mapper.Map<IEnumerable<StageListDto>>(stages));
        }

        // GET /api/tournaments/{tournamentId}/stages/{stageId}
        [HttpGet("{stageId}")]
        public async Task<ActionResult<StageDetailsDto>> GetStage(int tournamentId, int stageId)
        {
            if (!await _stageRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament with Id {tournamentId} not found.");

            if (!await _stageRepository.StageExistsAsync(stageId))
                return NotFound($"Stage with Id {stageId} not found.");

            var stage = await _stageRepository.GetStageAsync(stageId);
            return Ok(_mapper.Map<StageDetailsDto>(stage));
        }
    }
}