using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class TournamentForCreationDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        [Required]
        public decimal PrizePool { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public TournamentStatus Status { get; set; }

        [Required]
        public TournamentFormat Format { get; set; }

        [Required]
        public int GameId { get; set; }
    }
}