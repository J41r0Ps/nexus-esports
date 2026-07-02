using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Team
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(10)]
        public string Tag { get; set; } // e.g. "NaVi", "FaZe"

        [MaxLength(200)]
        public string? LogoUrl { get; set; }

        [Required]
        [MaxLength(50)]
        public Region Region { get; set; }    

        [Required]
        public int FoundedYear { get; set; }
        public int? PandaScoreId { get; set; }

        [ForeignKey("GameId")]
        public int GameId { get; set; }
        public Game? Game { get; set; }

        [ForeignKey("OrganizationId")]
        public int OrganizationId { get; set; }
        public Organization? Organization { get; set; }

        [ForeignKey("CountryId")]
        public int CountryId { get; set; }
        public Country? Country { get; set; }

        public ICollection<Player> Players { get; set; } = new List<Player>();
        public ICollection<Sponsor> Sponsors { get; set; } = new List<Sponsor>();
        public ICollection<TeamSponsor> TeamSponsors { get; set; } = new List<TeamSponsor>();
        public ICollection<TournamentRegistration> TournamentRegistrations { get; set; } = new List<TournamentRegistration>();

        public Team(string name, string tag)
        {
            Name = name;
            Tag = tag;
        }
    }
}