using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexus.Infrastructure.ExternalServices.Cloudinary;

namespace Nexus.API.Controllers
{
    [Route("api/upload")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IImageUploadService _uploadService;

        public UploadController(IImageUploadService uploadService)
        {
            _uploadService = uploadService;
        }

        // POST /api/upload/image?folder=teams
        [HttpPost("image")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> UploadImage(
            IFormFile file,
            [FromQuery] string folder = "misc")
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var allowedFolders = new[] { "teams", "players", "tournaments", "sponsors", "misc" };
            if (!allowedFolders.Contains(folder))
                return BadRequest($"Invalid folder. Use: {string.Join(", ", allowedFolders)}");

            try
            {
                var url = await _uploadService.UploadImageAsync(file, folder);
                return Ok(new { url });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}