using AutoMapper;
using Nexus.Contracts.Models;
using Nexus.Domain.Entities;

namespace Nexus.API.MappingProfiles
{
    public class TournamentProfile : Profile
    {
        public TournamentProfile()
        {
            // Entity → List DTO
            CreateMap<Tournament, TournamentListDto>()
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Format,
                    opt => opt.MapFrom(src => src.Format.ToString()))
                .ForMember(dest => dest.GameName,
                    opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.StartDate,
                    opt => opt.MapFrom(src => src.StartDate.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.EndDate,
                    opt => opt.MapFrom(src => src.EndDate.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.TotalStages,
                    opt => opt.MapFrom(src => src.Stages.Count))
                .ForMember(dest => dest.TotalTeams,
                    opt => opt.MapFrom(src => src.TournamentRegistrations.Count));

            // Entity → Details DTO
            CreateMap<Tournament, TournamentDetailsDto>()
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Format,
                    opt => opt.MapFrom(src => src.Format.ToString()))
                .ForMember(dest => dest.GameName,
                    opt => opt.MapFrom(src => src.Game.Name))
                .ForMember(dest => dest.StartDate,
                    opt => opt.MapFrom(src => src.StartDate.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.EndDate,
                    opt => opt.MapFrom(src => src.EndDate.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.RegisteredTeams,
                    opt => opt.MapFrom(src => src.TournamentRegistrations));

            // Nested: Stage → StageDto
            CreateMap<Stage, TournamentStageDto>()
                .ForMember(dest => dest.StageType,
                    opt => opt.MapFrom(src => src.StageType.ToString()))
                .ForMember(dest => dest.TotalMatches,
                    opt => opt.MapFrom(src => src.Matches.Count));

            // Nested: TournamentRegistration → TournamentTeamDto
            CreateMap<TournamentRegistration, TournamentTeamDto>()
                .ForMember(dest => dest.TeamId,
                    opt => opt.MapFrom(src => src.Team.Id))
                .ForMember(dest => dest.TeamName,
                    opt => opt.MapFrom(src => src.Team.Name))
                .ForMember(dest => dest.TeamTag,
                    opt => opt.MapFrom(src => src.Team.Tag))
                .ForMember(dest => dest.TeamFlag,
                    opt => opt.MapFrom(src => src.Team.Country.FlagUrl))
                .ForMember(dest => dest.RegisteredAt,
                    opt => opt.MapFrom(src => src.RegisteredAt.ToString("dd/MM/yyyy")));

            // Creation DTO → Entity
            CreateMap<TournamentForCreationDto, Tournament>()
                .ConstructUsing(src => new Tournament(src.Name));

            // Update DTO → Entity
            CreateMap<TournamentForUpdateDto, Tournament>()
                .ConstructUsing(src => new Tournament(src.Name));

            // Creation DTO tournamentRegistration → Entity
            CreateMap<TournamentRegistration, TournamentRegistrationDto>()
                .ForMember(dest => dest.TeamName, opt => opt.MapFrom(src => src.Team.Name))
                .ForMember(dest => dest.TeamTag, opt => opt.MapFrom(src => src.Team.Tag))
                .ForMember(dest => dest.RegisteredAt, opt => opt.MapFrom(src => src.RegisteredAt.ToString("dd/MM/yyyy")));
        }
    }
}