using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class TeamSponsorForCreationDto
    {
        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}