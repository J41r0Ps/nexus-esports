using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts.Models;
using Nexus.Contracts;
using Nexus.Infrastructure.Services;
using Nexus.Domain.Entities;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace Nexus.API.Controllers
{
    [Route("api/teams")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IMapper _mapper;
        private const int MaxPageSize = 50;

        public TeamsController(ITeamRepository teamRepository, IMapper mapper)
        {
            _teamRepository = teamRepository;
            _mapper = mapper;
        }

        // GET /api/teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamListDto>>> GetTeams(
            [FromQuery] string? searchQuery,
            [FromQuery] string? region,
            [FromQuery] int? gameId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            var teams = await _teamRepository.GetTeamsAsync(
                searchQuery, region, gameId, pageNumber, pageSize);

            var totalCount = await _teamRepository.GetTeamCountAsync(
                searchQuery, region, gameId);

            Response.Headers.Add("X-Pagination",
                JsonSerializer.Serialize(new PaginationMetadata(totalCount, pageSize, pageNumber)));

            return Ok(_mapper.Map<IEnumerable<TeamListDto>>(teams));
        }

        // GET /api/teams/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDetailsDto>> GetTeam(int id)
        {
            if (!await _teamRepository.TeamExistsAsync(id))
                return NotFound();

            var team = await _teamRepository.GetTeamAsync(id);
            return Ok(_mapper.Map<TeamDetailsDto>(team));
        }

        // POST /api/teams
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<TeamDetailsDto>> CreateTeam(TeamForCreationDto teamForCreation)
        {
            if (!await _teamRepository.GameExistsAsync(teamForCreation.GameId))
                return BadRequest($"Game with Id {teamForCreation.GameId} does not exist.");

            if (!await _teamRepository.OrganizationExistsAsync(teamForCreation.OrganizationId))
                return BadRequest($"Organization with Id {teamForCreation.OrganizationId} does not exist.");

            if (!await _teamRepository.CountryExistsAsync(teamForCreation.CountryId))
                return BadRequest($"Country with Id {teamForCreation.CountryId} does not exist.");

            var team = _mapper.Map<Team>(teamForCreation);
            _teamRepository.AddTeam(team);
            await _teamRepository.SaveChangesAsync();

            var teamToReturn = _mapper.Map<TeamDetailsDto>(team);
            return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, teamToReturn);
        }

        // PUT /api/teams/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UpdateTeam(int id, TeamForUpdateDto teamForUpdate)
        {
            if (!await _teamRepository.TeamExistsAsync(id))
                return NotFound();

            if (!await _teamRepository.GameExistsAsync(teamForUpdate.GameId))
                return BadRequest($"Game with Id {teamForUpdate.GameId} does not exist.");

            if (!await _teamRepository.OrganizationExistsAsync(teamForUpdate.OrganizationId))
                return BadRequest($"Organization with Id {teamForUpdate.OrganizationId} does not exist.");

            if (!await _teamRepository.CountryExistsAsync(teamForUpdate.CountryId))
                return BadRequest($"Country with Id {teamForUpdate.CountryId} does not exist.");

            var team = await _teamRepository.GetTeamAsync(id);
            _mapper.Map(teamForUpdate, team);
            await _teamRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/teams/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeleteTeam(int id)
        {
            if (!await _teamRepository.TeamExistsAsync(id))
                return NotFound();

            if (await _teamRepository.HasPlayersAsync(id))
                return BadRequest("Cannot delete team with active players. Remove players first.");

            var team = await _teamRepository.GetTeamAsync(id);
            _teamRepository.DeleteTeam(team!);
            await _teamRepository.SaveChangesAsync();

            return NoContent();
        }

        // Teams Sponsors Endpoints

        // POST /api/teams/{teamId}/sponsors/{sponsorId}
        [HttpPost("{teamId}/sponsors/{sponsorId}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> AddSponsorToTeam(
            int teamId, int sponsorId, TeamSponsorForCreationDto dto)
        {
            if (!await _teamRepository.TeamExistsAsync(teamId))
                return NotFound($"Team with Id {teamId} not found.");

            if (!await _teamRepository.SponsorExistsAsync(sponsorId))
                return NotFound($"Sponsor with Id {sponsorId} not found.");

            if (await _teamRepository.TeamSponsorExistsAsync(teamId, sponsorId))
                return BadRequest("This sponsor is already linked to this team.");

            var teamSponsor = new TeamSponsor
            {
                TeamId = teamId,
                SponsorId = sponsorId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _teamRepository.AddTeamSponsor(teamSponsor);
            await _teamRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeam), new { id = teamId }, null);
        }

        // DELETE /api/teams/{teamId}/sponsors/{sponsorId}
        [HttpDelete("{teamId}/sponsors/{sponsorId}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> RemoveSponsorFromTeam(int teamId, int sponsorId)
        {
            var teamSponsor = await _teamRepository.GetTeamSponsorAsync(teamId, sponsorId);
            if (teamSponsor == null)
                return NotFound("This sponsor is not linked to this team.");

            _teamRepository.RemoveTeamSponsor(teamSponsor);
            await _teamRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}