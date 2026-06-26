using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class StageProfile : Profile
    {
        public StageProfile()
        {
            CreateMap<Stage, StageListDto>()
                .ForMember(dest => dest.StageType,
                    opt => opt.MapFrom(src => src.StageType.ToString()))
                .ForMember(dest => dest.TotalMatches,
                    opt => opt.MapFrom(src => src.Matches.Count));

            CreateMap<Stage, StageDetailsDto>()
                .ForMember(dest => dest.StageType,
                    opt => opt.MapFrom(src => src.StageType.ToString()));

            CreateMap<Match, StageMatchDto>()
                .ForMember(dest => dest.MatchDate,
                    opt => opt.MapFrom(src => src.MatchDate.ToString("dd/MM/yyyy HH:mm")))
                .ForMember(dest => dest.Team1Name,
                    opt => opt.MapFrom(src => src.Team1.Name))
                .ForMember(dest => dest.Team2Name,
                    opt => opt.MapFrom(src => src.Team2.Name));
        }
    }
}