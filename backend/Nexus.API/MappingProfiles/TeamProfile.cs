using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class TeamProfile : Profile
    {
        public TeamProfile()
        {
            // Entity → List DTO
            CreateMap<Team, TeamListDto>()
                .ForMember(dest => dest.GameName,
                    opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.Region,
                    opt => opt.MapFrom(src => src.Region.ToString()));

            // Entity → Details DTO
            CreateMap<Team, TeamDetailsDto>()
                .ForMember(dest => dest.GameName,
                    opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.OrganizationName,
                    opt => opt.MapFrom(src => src.Organization.Name))
                .ForMember(dest => dest.CountryName,
                    opt => opt.MapFrom(src => src.Country.Name))
                .ForMember(dest => dest.Region,
                    opt => opt.MapFrom(src => src.Region.ToString()));

            // Nested DTOs
            CreateMap<Player, TeamPlayerDto>()
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<Sponsor, TeamSponsorDto>()
                .ForMember(dest => dest.Industry,
                    opt => opt.MapFrom(src => src.Industry.ToString()));

            // Creation DTO → Entity
            CreateMap<TeamForCreationDto, Team>();

            // Update DTO → Entity
            CreateMap<TeamForUpdateDto, Team>();
        }
    }
}