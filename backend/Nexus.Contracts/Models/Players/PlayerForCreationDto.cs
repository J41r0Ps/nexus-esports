using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class PlayerForCreationDto
    {
        [Required]
        [MaxLength(100)]
        public string Gamertag { get; set; }

        [Required]
        [MaxLength(100)]
        public string RealName { get; set; }

        [Required]
        public PlayerRole Role { get; set; }

        [Required]
        public int YearOfBirth { get; set; }

        [Required]
        public decimal Salary { get; set; }

        public string? PhotoUrl { get; set; }

        [Required]
        public int TeamId { get; set; }

        [Required]
        public int CountryId { get; set; }
    }
}