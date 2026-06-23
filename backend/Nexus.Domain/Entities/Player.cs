using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Player
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Gamertag { get; set; }

        [Required]
        [MaxLength(100)]
        public string RealName { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } // Fragger, IGL, Support, etc.

        [Required]
        public int YearOfBirth { get; set; }

        [Required]
        public decimal Salary { get; set; }

        [MaxLength(200)]
        public string? PhotoUrl { get; set; }

        [ForeignKey("TeamId")]
        public int TeamId { get; set; }
        public Team? Team { get; set; }

        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }

        public ICollection<PlayerStat> PlayerStats { get; set; } = new List<PlayerStat>();
        public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();

        public Player(string gamertag, string realName)
        {
            Gamertag = gamertag;
            RealName = realName;
        }
    }
}