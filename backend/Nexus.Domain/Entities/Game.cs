using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Game
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public GameGenre Genre { get; set; }  

        [Required]
        [MaxLength(100)]
        public string Publisher { get; set; }

        [MaxLength(200)]
        public string? CoverImageUrl { get; set; }

        [MaxLength(50)]
        public string? PandaScoreSlug { get; set; }

        public ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();

        public Game(string name, GameGenre genre, string publisher)
        {
            Name = name;
            Genre = genre;
            Publisher = publisher;
        }
    }
}
