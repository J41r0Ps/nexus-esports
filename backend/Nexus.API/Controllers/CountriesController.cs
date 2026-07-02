using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Nexus.Contracts.Models;
using Nexus.Infrastructure.Services;

namespace Nexus.API.Controllers
{
    [Route("api/countries")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly ICountryRepository _countryRepository;
        private readonly IMapper _mapper;

        public CountriesController(ICountryRepository countryRepository, IMapper mapper)
        {
            _countryRepository = countryRepository;
            _mapper = mapper;
        }

        // GET /api/countries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CountryListDto>>> GetCountries()
        {
            var countries = await _countryRepository.GetCountriesAsync();
            return Ok(_mapper.Map<IEnumerable<CountryListDto>>(countries));
        }

        [HttpGet("with-players")]
        public async Task<ActionResult<IEnumerable<CountryListDto>>> GetCountriesWithPlayers()
        {
            var countries = await _countryRepository.GetCountriesWithPlayersAsync();
            return Ok(_mapper.Map<IEnumerable<CountryListDto>>(countries));
        }
    }
}