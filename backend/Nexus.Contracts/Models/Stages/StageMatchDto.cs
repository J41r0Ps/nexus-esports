namespace Nexus.Contracts.Models
{
    public class StageMatchDto
    {
        public int Id { get; set; }
        public string MatchDate { get; set; }
        public string? StreamUrl { get; set; }
        public string Team1Name { get; set; }
        public string Team2Name { get; set; }
        public int? WinnerId { get; set; }
    }
}