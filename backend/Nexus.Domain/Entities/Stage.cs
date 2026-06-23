using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Stage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public StageType StageType { get; set; }

        [Required]
        public int Order { get; set; }

        [ForeignKey("TournamentId")]
        public int TournamentId { get; set; }
        public Tournament? Tournament { get; set; }

        public ICollection<Match> Matches { get; set; } = new List<Match>();

        public Stage(StageType stageType)
        {
            StageType = stageType;
        }
    }
}