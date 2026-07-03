using Microsoft.AspNetCore.SignalR;

namespace Nexus.API.Hubs
{
    public class MatchHub : Hub
    {
        public async Task JoinTournament(string tournamentId)
            => await Groups.AddToGroupAsync(Context.ConnectionId, $"tournament-{tournamentId}");

        public async Task LeaveTournament(string tournamentId)
            => await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"tournament-{tournamentId}");

        public async Task JoinGlobal()
            => await Groups.AddToGroupAsync(Context.ConnectionId, "global-matches");

        public async Task LeaveGlobal()
            => await Groups.RemoveFromGroupAsync(Context.ConnectionId, "global-matches");
    }
}