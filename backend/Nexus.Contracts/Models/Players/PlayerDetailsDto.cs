namespace Nexus.Contracts.Models
{
    public class PlayerDetailsDto
    {
        public int Id { get; set; }
        public string Gamertag { get; set; }
        public string RealName { get; set; }
        public string Role { get; set; }
        public int YearOfBirth { get; set; }
        public decimal Salary { get; set; }
        public string? PhotoUrl { get; set; }
        public string TeamName { get; set; }
        public string CountryName { get; set; }
        public ICollection<PlayerStatDto> PlayerStats { get; set; } = new List<PlayerStatDto>();
        public ICollection<PlayerAchievementDto> Achievements { get; set; } = new List<PlayerAchievementDto>();
    }
}