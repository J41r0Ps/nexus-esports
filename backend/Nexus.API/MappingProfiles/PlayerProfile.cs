using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class PlayerProfile : Profile
    {
        public PlayerProfile()
        {
            // Entity → List DTO
            CreateMap<Player, PlayerListDto>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.TeamName,
                    opt => opt.MapFrom(src => src.Team.Name))
                .ForMember(dest => dest.CountryName,
                    opt => opt.MapFrom(src => src.Country.Name))
                .ForMember(dest => dest.CountryFlag,
                    opt => opt.MapFrom(src => src.Country.FlagUrl));

            // Entity → Details DTO
            CreateMap<Player, PlayerDetailsDto>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.TeamName,
                    opt => opt.MapFrom(src => src.Team.Name))
                .ForMember(dest => dest.CountryName,
                    opt => opt.MapFrom(src => src.Country.Name));

            // Nested DTOs
            CreateMap<PlayerStat, PlayerStatDto>();

            CreateMap<Achievement, PlayerAchievementDto>()
                .ForMember(dest => dest.Date,
                    opt => opt.MapFrom(src => src.Date.ToString("dd/MM/yyyy")));

            // Creation DTO → Entity
            CreateMap<PlayerForCreationDto, Player>()
                .ConstructUsing(src => new Player(src.Gamertag, src.RealName));

            // Update DTO → Entity
            CreateMap<PlayerForUpdateDto, Player>()
                .ConstructUsing(src => new Player(src.Gamertag, src.RealName));
        }
    }
}