using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class MatchProfile : Profile
    {
        public MatchProfile()
        {
            CreateMap<Match, MatchListDto>()
                .ForMember(dest => dest.MatchDate,
                    opt => opt.MapFrom(src => src.MatchDate.ToString("dd/MM/yyyy HH:mm")))
                .ForMember(dest => dest.Team1Name,
                    opt => opt.MapFrom(src => src.Team1.Name))
                .ForMember(dest => dest.Team1Logo,
                    opt => opt.MapFrom(src => src.Team1.LogoUrl))
                .ForMember(dest => dest.Team2Name,
                    opt => opt.MapFrom(src => src.Team2.Name))
                .ForMember(dest => dest.Team2Logo,
                    opt => opt.MapFrom(src => src.Team2.LogoUrl))
                .ForMember(dest => dest.StageName,
                    opt => opt.MapFrom(src => src.Stage.StageType.ToString()));

            CreateMap<Match, MatchDetailsDto>()
                .ForMember(dest => dest.MatchDate,
                    opt => opt.MapFrom(src => src.MatchDate.ToString("dd/MM/yyyy HH:mm")))
                .ForMember(dest => dest.StageName,
                    opt => opt.MapFrom(src => src.Stage.StageType.ToString()))
                .ForMember(dest => dest.Team1,
                    opt => opt.MapFrom(src => src.Team1))
                .ForMember(dest => dest.Team2,
                    opt => opt.MapFrom(src => src.Team2));

            CreateMap<Team, MatchTeamDto>();

            CreateMap<PlayerStat, MatchPlayerStatDto>()
                .ForMember(dest => dest.PlayerId,
                    opt => opt.MapFrom(src => src.Player.Id))
                .ForMember(dest => dest.Gamertag,
                    opt => opt.MapFrom(src => src.Player.Gamertag))
                .ForMember(dest => dest.PhotoUrl,
                    opt => opt.MapFrom(src => src.Player.PhotoUrl));
        }
    }
}