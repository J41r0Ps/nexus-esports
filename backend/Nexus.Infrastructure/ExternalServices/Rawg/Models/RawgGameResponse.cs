using System.Text.Json.Serialization;

namespace Nexus.Infrastructure.ExternalServices.Rawg.Models
{
    public class RawgSearchResponse
    {
        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("results")]
        public List<RawgGame> Results { get; set; } = new();
    }

    public class RawgGame
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("background_image")]
        public string? BackgroundImage { get; set; }

        [JsonPropertyName("released")]
        public string? Released { get; set; }

        [JsonPropertyName("rating")]
        public double Rating { get; set; }

        [JsonPropertyName("genres")]
        public List<RawgGenre>? Genres { get; set; }

        [JsonPropertyName("publishers")]
        public List<RawgPublisher>? Publishers { get; set; }
    }

    public class RawgGenre
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class RawgPublisher
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}