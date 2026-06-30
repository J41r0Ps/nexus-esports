using Microsoft.Extensions.Configuration;

namespace Nexus.Infrastructure.Strategies
{
    public class ConsoleEmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public ConsoleEmailService(IConfiguration config)
        {
            _config = config;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            Console.WriteLine($"[DEV] Email from {_config["EmailSettings:From"]} " +
                              $"to {to} - Subject: {subject} - Body: {body}");
            return Task.CompletedTask;
        }
    }
}