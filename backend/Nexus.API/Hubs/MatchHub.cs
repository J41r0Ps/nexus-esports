using Microsoft.AspNetCore.SignalR;

namespace Nexus.API.Hubs
{
    public class MatchHub : Hub
    {
        // Client calls this to join a specific tournament's "room"
        public async Task JoinTournament(string tournamentId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"tournament-{tournamentId}");
        }

        public async Task LeaveTournament(string tournamentId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"tournament-{tournamentId}");
        }
    }
}