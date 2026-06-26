namespace Nexus.Contracts.Models
{
    public class TournamentStageDto
    {
        public int Id { get; set; }
        public string StageType { get; set; }
        public int Order { get; set; }
        public int TotalMatches { get; set; }
    }
}