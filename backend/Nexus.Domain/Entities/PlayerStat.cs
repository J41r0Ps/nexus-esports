using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class PlayerStat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int Kills { get; set; }

        [Required]
        public int Deaths { get; set; }

        [Required]
        public int Assists { get; set; }

        [Required]
        public decimal Score { get; set; }

        [ForeignKey("PlayerId")]
        public int PlayerId { get; set; }
        public Player? Player { get; set; }

        [ForeignKey("MatchId")]
        public int MatchId { get; set; }
        public Match? Match { get; set; }
    }
}