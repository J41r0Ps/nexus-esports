using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class GameProfile : Profile
    {
        public GameProfile()
        {
            CreateMap<Game, GameListDto>()
                .ForMember(dest => dest.Genre,
                    opt => opt.MapFrom(src => src.Genre.ToString()));
        }
    }
}