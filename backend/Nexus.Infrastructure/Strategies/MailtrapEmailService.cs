using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace Nexus.Infrastructure.Strategies
{
    public class MailtrapEmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly SmtpClient _smtpClient;

        public MailtrapEmailService(IConfiguration config)
        {
            _config = config;
            _smtpClient = new SmtpClient(config["EmailSettings:SmtpServer"])
            {
                Port = int.Parse(config["EmailSettings:Port"]),
                Credentials = new NetworkCredential(
                    config["EmailSettings:Username"],
                    config["EmailSettings:Password"]),
                EnableSsl = true
            };
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var mailMessage = new MailMessage(
                _config["EmailSettings:From"], to, subject, body);
            await _smtpClient.SendMailAsync(mailMessage);
        }
    }
}