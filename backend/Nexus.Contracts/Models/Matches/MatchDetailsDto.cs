namespace Nexus.Contracts.Models
{
    public class MatchDetailsDto
    {
        public int Id { get; set; }
        public string MatchDate { get; set; }
        public string? StreamUrl { get; set; }
        public int? WinnerId { get; set; }
        public string StageName { get; set; }
        public MatchTeamDto Team1 { get; set; }
        public MatchTeamDto Team2 { get; set; }
        public ICollection<MatchPlayerStatDto> PlayerStats { get; set; } = new List<MatchPlayerStatDto>();
    }
}