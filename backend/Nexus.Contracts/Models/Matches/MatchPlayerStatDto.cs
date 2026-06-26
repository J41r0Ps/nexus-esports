namespace Nexus.Contracts.Models
{
    public class MatchPlayerStatDto
    {
        public int PlayerId { get; set; }
        public string Gamertag { get; set; }
        public string? PhotoUrl { get; set; }
        public int Kills { get; set; }
        public int Deaths { get; set; }
        public int Assists { get; set; }
        public decimal Score { get; set; }
    }
}