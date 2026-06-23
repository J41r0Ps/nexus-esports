using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Match
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public DateTime MatchDate { get; set; }

        [MaxLength(200)]
        public string? StreamUrl { get; set; }

        public int? WinnerId { get; set; } // null if not played yet

        [ForeignKey("StageId")]
        public int StageId { get; set; }
        public Stage? Stage { get; set; }

        [ForeignKey("Team1Id")]
        public int Team1Id { get; set; }
        public Team? Team1 { get; set; }

        [ForeignKey("Team2Id")]
        public int Team2Id { get; set; }
        public Team? Team2 { get; set; }

        public ICollection<PlayerStat> PlayerStats { get; set; } = new List<PlayerStat>();

        public Match(DateTime matchDate)
        {
            MatchDate = matchDate;
        }
    }
}