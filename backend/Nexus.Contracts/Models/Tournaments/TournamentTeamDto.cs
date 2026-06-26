namespace Nexus.Contracts.Models
{
    public class TournamentTeamDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamTag { get; set; }
        public int SeedNumber { get; set; }
        public string RegisteredAt { get; set; }
    }
}