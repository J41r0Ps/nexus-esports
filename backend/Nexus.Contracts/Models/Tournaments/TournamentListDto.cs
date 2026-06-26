namespace Nexus.Contracts.Models
{
    public class TournamentListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal PrizePool { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Status { get; set; }
        public string Format { get; set; }
        public string GameName { get; set; }
        public int TotalStages { get; set; }
        public int TotalTeams { get; set; }
    }
}