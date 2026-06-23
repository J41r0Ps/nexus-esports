using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Tournament
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

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
        [MaxLength(50)]
        public string Status { get; set; } // Upcoming, Ongoing, Completed

        [Required]
        [MaxLength(50)]
        public string Format { get; set; } // Single Elimination, Double Elimination, Round Robin

        [ForeignKey("GameId")]
        public int GameId { get; set; }
        public Game? Game { get; set; }

        public ICollection<Stage> Stages { get; set; } = new List<Stage>();
        public ICollection<TournamentRegistration> TournamentRegistrations { get; set; } = new List<TournamentRegistration>();

        public Tournament(string name)
        {
            Name = name;
        }
    }
}