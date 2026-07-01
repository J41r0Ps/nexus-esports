namespace Nexus.Contracts.Models
{
    public class TeamDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Tag { get; set; }
        public string Region { get; set; }
        public string LogoUrl { get; set; }
        public int FoundedYear { get; set; }
        public string GameName { get; set; }
        public string OrganizationName { get; set; }
        public string CountryName { get; set; }
        public string? CountryFlag { get; set; }
        public ICollection<TeamPlayerDto> Players { get; set; } = new List<TeamPlayerDto>();
        public ICollection<TeamSponsorDto> Sponsors { get; set; } = new List<TeamSponsorDto>();
    }
}