using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Organization
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string? Website { get; set; }

        [Required]
        public int FoundedYear { get; set; }

        public ICollection<Team> Teams { get; set; } = new List<Team>();

        public Organization(string name)
        {
            Name = name;
        }
    }
}