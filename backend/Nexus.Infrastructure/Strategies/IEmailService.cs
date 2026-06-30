namespace Nexus.Infrastructure.Strategies
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}