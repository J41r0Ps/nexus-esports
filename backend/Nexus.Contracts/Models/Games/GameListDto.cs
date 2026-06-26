namespace Nexus.Contracts.Models
{
    public class GameListDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Genre { get; set; }
        public string Publisher { get; set; }
        public string? CoverImageUrl { get; set; }
    }
}