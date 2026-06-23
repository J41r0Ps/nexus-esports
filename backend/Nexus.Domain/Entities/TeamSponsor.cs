using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class TeamSponsor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [ForeignKey("TeamId")]
        public int TeamId { get; set; }
        public Team? Team { get; set; }

        [ForeignKey("SponsorId")]
        public int SponsorId { get; set; }
        public Sponsor? Sponsor { get; set; }
    }
}