using System.Text.Json.Serialization;

namespace Nexus.Infrastructure.ExternalServices.RestCountries.Models
{
    public class CountriesResponseV5
    {
        [JsonPropertyName("data")]
        public CountriesDataV5? Data { get; set; }
    }

    public class CountriesDataV5
    {
        [JsonPropertyName("objects")]
        public List<CountryV5> Objects { get; set; } = new();

        [JsonPropertyName("meta")]
        public CountriesMetaV5? Meta { get; set; }
    }

    public class CountriesMetaV5
    {
        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("returned")]
        public int Returned { get; set; }
    }

    public class CountryV5
    {
        [JsonPropertyName("names")]
        public CountryNamesV5? Names { get; set; }

        [JsonPropertyName("codes")]
        public CountryCodesV5? Codes { get; set; }

        [JsonPropertyName("flag")]
        public CountryFlagV5? Flag { get; set; }
    }

    public class CountryNamesV5
    {
        [JsonPropertyName("common")]
        public string Common { get; set; } = string.Empty;
    }

    public class CountryCodesV5
    {
        [JsonPropertyName("alpha_2")]
        public string? Alpha2 { get; set; }
    }

    public class CountryFlagV5
    {
        [JsonPropertyName("url_svg")]
        public string? UrlSvg { get; set; }

        [JsonPropertyName("url_png")]
        public string? UrlPng { get; set; }
    }
}