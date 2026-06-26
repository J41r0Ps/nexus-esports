namespace Nexus.Contracts.Models
{
    public class PlayerListDto
    {
        public int Id { get; set; }
        public string Gamertag { get; set; }
        public string RealName { get; set; }
        public string Role { get; set; }
        public string PhotoUrl { get; set; }
        public string TeamName { get; set; }
        public string CountryName { get; set; }
        public decimal Salary { get; set; }
    }
}