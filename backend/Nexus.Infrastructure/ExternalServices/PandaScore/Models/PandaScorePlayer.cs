using System.Text.Json.Serialization;

namespace Nexus.Infrastructure.ExternalServices.PandaScore.Models
{
    public class PandaScorePlayer
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }   // gamertag e.g. "s1mple"

        [JsonPropertyName("first_name")]
        public string? FirstName { get; set; }

        [JsonPropertyName("last_name")]
        public string? LastName { get; set; }

        [JsonPropertyName("nationality")]
        public string? Nationality { get; set; }  // 2-letter code

        [JsonPropertyName("image_url")]
        public string? ImageUrl { get; set; }

        [JsonPropertyName("birthday")]
        public string? Birthday { get; set; }  // "1997-10-02"

        [JsonPropertyName("role")]
        public string? Role { get; set; }

        [JsonPropertyName("current_team")]
        public PandaScoreTeam? CurrentTeam { get; set; }
    }
}