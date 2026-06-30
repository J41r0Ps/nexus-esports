namespace Nexus.Contracts.Models
{
    public class TournamentRegistrationDto
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamTag { get; set; }
        public int SeedNumber { get; set; }
        public string RegisteredAt { get; set; }
    }
}