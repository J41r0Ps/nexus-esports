namespace Nexus.Contracts.Models
{
    public class TournamentDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal PrizePool { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Status { get; set; }
        public string Format { get; set; }
        public string GameName { get; set; }
        public ICollection<TournamentStageDto> Stages { get; set; } = new List<TournamentStageDto>();
        public ICollection<TournamentTeamDto> RegisteredTeams { get; set; } = new List<TournamentTeamDto>();
    }
}