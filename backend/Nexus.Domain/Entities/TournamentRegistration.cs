using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class TournamentRegistration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int SeedNumber { get; set; }

        [Required]
        public DateTime RegisteredAt { get; set; }

        [ForeignKey("TeamId")]
        public int TeamId { get; set; }
        public Team? Team { get; set; }

        [ForeignKey("TournamentId")]
        public int TournamentId { get; set; }
        public Tournament? Tournament { get; set; }
    }
}