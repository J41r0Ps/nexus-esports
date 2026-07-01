using System.ComponentModel.DataAnnotations;

namespace Nexus.Contracts.Models
{
    public class MatchUpdateDto
    {
        [Required]
        public int WinnerId { get; set; }
    }
}