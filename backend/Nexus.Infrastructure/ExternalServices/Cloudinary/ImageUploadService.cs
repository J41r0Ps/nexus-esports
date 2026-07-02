using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Nexus.Infrastructure.ExternalServices.Cloudinary
{
    public class ImageUploadService : IImageUploadService
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public ImageUploadService(IConfiguration config)
        {
            var cloudName = config["Cloudinary:CloudName"]
                ?? throw new InvalidOperationException("Cloudinary CloudName missing");
            var apiKey = config["Cloudinary:ApiKey"]
                ?? throw new InvalidOperationException("Cloudinary ApiKey missing");
            var apiSecret = config["Cloudinary:ApiSecret"]
                ?? throw new InvalidOperationException("Cloudinary ApiSecret missing");

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new CloudinaryDotNet.Cloudinary(account);
        }

        public async Task<string?> UploadImageAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0) return null;

            // Validate
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                throw new InvalidOperationException("Only JPG, PNG, WEBP, GIF are allowed.");

            const long maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.Length > maxSize)
                throw new InvalidOperationException("File too large (max 5 MB).");

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = $"nexus/{folder}",              // organized folders
                Transformation = new Transformation()
                    .Width(600).Height(600).Crop("limit") // auto-resize big images
                    .Quality("auto")
                    .FetchFormat("auto")                  // serve WebP if browser supports
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
                throw new InvalidOperationException($"Upload failed: {result.Error.Message}");

            return result.SecureUrl.ToString();
        }

        public async Task<bool> DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok";
        }
    }
}