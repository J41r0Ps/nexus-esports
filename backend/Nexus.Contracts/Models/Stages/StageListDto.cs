namespace Nexus.Contracts.Models
{
    public class StageListDto
    {
        public int Id { get; set; }
        public string StageType { get; set; }
        public int Order { get; set; }
        public int TournamentId { get; set; }
        public int TotalMatches { get; set; }
    }
}