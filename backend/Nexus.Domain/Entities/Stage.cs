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
        public string Name { get; set; } // Group Stage, Semifinals, Finals

        [Required]
        public int Order { get; set; }

        [ForeignKey("TournamentId")]
        public int TournamentId { get; set; }
        public Tournament? Tournament { get; set; }

        public ICollection<Match> Matches { get; set; } = new List<Match>();

        public Stage(string name)
        {
            Name = name;
        }
    }
}