using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class TournamentRegistrationForCreationDto
    {
        [Required]
        public int TeamId { get; set; }

        [Required]
        public int SeedNumber { get; set; }
    }
}