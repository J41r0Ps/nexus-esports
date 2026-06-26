namespace Nexus.Contracts.Models
{
    public class StageDetailsDto
    {
        public int Id { get; set; }
        public string StageType { get; set; }
        public int Order { get; set; }
        public int TournamentId { get; set; }
        public ICollection<StageMatchDto> Matches { get; set; } = new List<StageMatchDto>();
    }
}