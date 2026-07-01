using System.Text.Json.Serialization;

namespace Nexus.Infrastructure.ExternalServices.PandaScore.Models
{
    public class PandaScoreTeam
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("acronym")]
        public string? Acronym { get; set; }

        [JsonPropertyName("image_url")]
        public string? ImageUrl { get; set; }

        [JsonPropertyName("location")]
        public string? Location { get; set; }   

        [JsonPropertyName("current_videogame")]
        public PandaScoreVideogame? CurrentVideogame { get; set; }
    }

    public class PandaScoreVideogame
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("slug")]
        public string Slug { get; set; } = string.Empty;
    }
}