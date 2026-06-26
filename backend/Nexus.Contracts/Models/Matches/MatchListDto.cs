namespace Nexus.Contracts.Models
{
    public class MatchListDto
    {
        public int Id { get; set; }
        public string MatchDate { get; set; }
        public string? StreamUrl { get; set; }
        public string Team1Name { get; set; }
        public string Team1Logo { get; set; }
        public string Team2Name { get; set; }
        public string Team2Logo { get; set; }
        public int? WinnerId { get; set; }
        public string StageName { get; set; }
    }
}