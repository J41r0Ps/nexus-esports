using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;
using Nexus.Infrastructure.Services;
using Nexus.Infrastructure.Strategies;
using System.Text.Json;

namespace Nexus.API.Controllers
{
    [Route("api/tournaments")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly ITournamentRepository _tournamentRepository;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private const int MaxPageSize = 50;

        public TournamentsController(ITournamentRepository tournamentRepository, IMapper mapper, IEmailService emailService)
        {
            _tournamentRepository = tournamentRepository;
            _mapper = mapper;
            _emailService = emailService;
        }

        // GET /api/tournaments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TournamentListDto>>> GetTournaments(
            [FromQuery] string? searchQuery,
            [FromQuery] string? status,
            [FromQuery] string? format,
            [FromQuery] int? gameId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            var tournaments = await _tournamentRepository.GetTournamentsAsync(
                searchQuery, status, format, gameId, pageNumber, pageSize);

            var totalCount = await _tournamentRepository.GetTournamentCountAsync(
                searchQuery, status, format, gameId);

            Response.Headers.Add("X-Pagination",
                JsonSerializer.Serialize(new PaginationMetadata(totalCount, pageSize, pageNumber)));

            return Ok(_mapper.Map<IEnumerable<TournamentListDto>>(tournaments));
        }

        // GET /api/tournaments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TournamentDetailsDto>> GetTournament(int id)
        {
            if (!await _tournamentRepository.TournamentExistsAsync(id))
                return NotFound();

            var tournament = await _tournamentRepository.GetTournamentAsync(id);
            return Ok(_mapper.Map<TournamentDetailsDto>(tournament));
        }

        // POST /api/tournaments
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<TournamentDetailsDto>> CreateTournament(
            TournamentForCreationDto tournamentForCreation)
        {
            if (!await _tournamentRepository.GameExistsAsync(tournamentForCreation.GameId))
                return BadRequest($"Game with Id {tournamentForCreation.GameId} does not exist.");

            if (tournamentForCreation.EndDate <= tournamentForCreation.StartDate)
                return BadRequest("EndDate must be after StartDate.");

            var tournament = _mapper.Map<Tournament>(tournamentForCreation);
            _tournamentRepository.AddTournament(tournament);
            await _tournamentRepository.SaveChangesAsync();

            var tournamentToReturn = _mapper.Map<TournamentDetailsDto>(tournament);
            return CreatedAtAction(nameof(GetTournament),
                new { id = tournament.Id }, tournamentToReturn);
        }

        // PUT /api/tournaments/{id}
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UpdateTournament(
            int id, TournamentForUpdateDto tournamentForUpdate)
        {
            if (!await _tournamentRepository.TournamentExistsAsync(id))
                return NotFound();

            if (!await _tournamentRepository.GameExistsAsync(tournamentForUpdate.GameId))
                return BadRequest($"Game with Id {tournamentForUpdate.GameId} does not exist.");

            if (tournamentForUpdate.EndDate <= tournamentForUpdate.StartDate)
                return BadRequest("EndDate must be after StartDate.");

            var tournament = await _tournamentRepository.GetTournamentAsync(id);
            _mapper.Map(tournamentForUpdate, tournament);
            await _tournamentRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/tournaments/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeleteTournament(int id)
        {
            if (!await _tournamentRepository.TournamentExistsAsync(id))
                return NotFound();

            if (await _tournamentRepository.HasRegistrationsAsync(id))
                return BadRequest("Cannot delete tournament with registered teams.");

            var tournament = await _tournamentRepository.GetTournamentAsync(id);
            _tournamentRepository.DeleteTournament(tournament!);
            await _tournamentRepository.SaveChangesAsync();

            return NoContent();
        }

        // Tournament Registration Endpoints
        // GET /api/tournaments/{tournamentId}/registrations
        [HttpGet("{tournamentId}/registrations")]
        public async Task<ActionResult<IEnumerable<TournamentRegistrationDto>>> GetRegistrations(int tournamentId)
        {
            if (!await _tournamentRepository.TournamentExistsAsync(tournamentId))
                return NotFound();

            var registrations = await _tournamentRepository.GetRegistrationsAsync(tournamentId);
            return Ok(_mapper.Map<IEnumerable<TournamentRegistrationDto>>(registrations));
        }

        // POST /api/tournaments/{tournamentId}/registrations
        [HttpPost("{tournamentId}/registrations")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> RegisterTeam(
            int tournamentId, TournamentRegistrationForCreationDto dto)
        {
            if (!await _tournamentRepository.TournamentExistsAsync(tournamentId))
                return NotFound($"Tournament with Id {tournamentId} not found.");

            if (!await _tournamentRepository.TeamExistsAsync(dto.TeamId))
                return NotFound($"Team with Id {dto.TeamId} not found.");

            if (await _tournamentRepository.IsTeamRegisteredAsync(tournamentId, dto.TeamId))
                return BadRequest("This team is already registered for this tournament.");

            var registration = new TournamentRegistration
            {
                TournamentId = tournamentId,
                TeamId = dto.TeamId,
                SeedNumber = dto.SeedNumber,
                RegisteredAt = DateTime.Now
            };

            _tournamentRepository.AddRegistration(registration);
            await _tournamentRepository.SaveChangesAsync();

            // send confirmation email
            var tournament = await _tournamentRepository.GetTournamentAsync(tournamentId);
            await _emailService.SendEmailAsync(
                dto.ContactEmail,
                $"Registration Confirmed - {tournament!.Name}",
                $"Your team has been registered with seed number {dto.SeedNumber} for {tournament.Name}. Good luck!"
            );

            return CreatedAtAction(nameof(GetRegistrations), new { tournamentId }, null);
        }

        // DELETE /api/tournaments/{tournamentId}/registrations/{teamId}
        [HttpDelete("{tournamentId}/registrations/{teamId}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UnregisterTeam(int tournamentId, int teamId)
        {
            var registration = await _tournamentRepository.GetRegistrationAsync(tournamentId, teamId);
            if (registration == null)
                return NotFound("This team is not registered for this tournament.");

            _tournamentRepository.RemoveRegistration(registration);
            await _tournamentRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}