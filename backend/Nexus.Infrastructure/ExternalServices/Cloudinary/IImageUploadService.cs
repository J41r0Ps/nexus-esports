using Microsoft.AspNetCore.Http;

namespace Nexus.Infrastructure.ExternalServices.Cloudinary
{
    public interface IImageUploadService
    {
        Task<string?> UploadImageAsync(IFormFile file, string folder);
        Task<bool> DeleteImageAsync(string publicId);
    }
}