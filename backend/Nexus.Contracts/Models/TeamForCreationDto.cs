using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class TeamForCreationDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(10)]
        public string Tag { get; set; }

        [Required]
        public string Region { get; set; }

        public string? LogoUrl { get; set; }

        [Required]
        public int FoundedYear { get; set; }

        [Required]
        public int GameId { get; set; }

        [Required]
        public int OrganizationId { get; set; }

        [Required]
        public int CountryId { get; set; }
    }
}