using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class CountryProfile : Profile
    {
        public CountryProfile()
        {
            CreateMap<Country, CountryListDto>();
        }
    }
}