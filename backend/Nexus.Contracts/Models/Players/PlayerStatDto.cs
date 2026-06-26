namespace Nexus.Contracts.Models
{
    public class PlayerStatDto
    {
        public int Id { get; set; }
        public int Kills { get; set; }
        public int Deaths { get; set; }
        public int Assists { get; set; }
        public decimal Score { get; set; }
        public int MatchId { get; set; }
    }
}