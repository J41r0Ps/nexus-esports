using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Country
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(10)]
        public string Code { get; set; }    // e.g. "US", "DE", "KR"
        
        [MaxLength(300)]
        public string? FlagUrl { get; set; }  

        public ICollection<Player> Players { get; set; } = new List<Player>();
        public ICollection<Team> Teams { get; set; } = new List<Team>();

        public Country(string name, string code)
        {
            Name = name;
            Code = code;
        }
    }
}