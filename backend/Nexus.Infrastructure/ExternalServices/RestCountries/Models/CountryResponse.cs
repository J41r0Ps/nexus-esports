using System.Text.Json.Serialization;

namespace Nexus.Infrastructure.ExternalServices.RestCountries.Models
{
    public class RestCountry
    {
        [JsonPropertyName("name")]
        public CountryName? Name { get; set; }

        [JsonPropertyName("cca2")]
        public string? Cca2 { get; set; }   // 2-letter code (e.g. "US")

        [JsonPropertyName("cca3")]
        public string? Cca3 { get; set; }   // 3-letter code (e.g. "USA")

        [JsonPropertyName("flags")]
        public CountryFlags? Flags { get; set; }
    }

    public class CountryName
    {
        [JsonPropertyName("common")]
        public string Common { get; set; } = string.Empty;

        [JsonPropertyName("official")]
        public string Official { get; set; } = string.Empty;
    }

    public class CountryFlags
    {
        [JsonPropertyName("png")]
        public string? Png { get; set; }

        [JsonPropertyName("svg")]
        public string? Svg { get; set; }
    }
}