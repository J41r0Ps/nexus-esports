using Nexus.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nexus.Domain.Entities
{
    public class Sponsor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public SponsorIndustry Industry { get; set; }  

        [MaxLength(200)]
        public string? LogoUrl { get; set; }

        [Required]
        public decimal ContractValue { get; set; }

        public ICollection<Team> Teams { get; set; } = new List<Team>();
        public ICollection<TeamSponsor> TeamSponsors { get; set; } = new List<TeamSponsor>();

        public Sponsor(string name, SponsorIndustry industry)
        {
            Name = name;
            Industry = industry;
        }
    }
}