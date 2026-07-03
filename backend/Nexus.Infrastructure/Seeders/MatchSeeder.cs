using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class MatchSeeder
    {
        // Real esports streamers/organizers per game
        private static readonly Dictionary<string, string[]> StreamChannels = new()
        {
            ["Counter-Strike 2"] = new[] { "esl_csgo", "blastpremier", "pgl_esports" },
            ["League of Legends"] = new[] { "riotgames", "lolesports", "lec" },
            ["Valorant"] = new[] { "valorant", "valorantesports", "vct" },
            ["Dota 2"] = new[] { "dota2ti", "pgl_esports", "beyondthesummit" },
            ["Rocket League"] = new[] { "rocketleague", "rlcs" },
            ["Overwatch 2"] = new[] { "playoverwatch", "owcs" },
            ["Rainbow Six Siege"] = new[] { "rainbow6", "blastr6" },
            ["StarCraft II"] = new[] { "esl_sc2", "wcs" }
        };

        public List<Match> Generate(
            List<Tournament> tournaments,
            List<Stage> stages,
            List<TournamentRegistration> registrations,
            List<Game> games)
        {
            var f = new Faker();
            var matches = new List<Match>();

            foreach (var tournament in tournaments)
            {
                // Registered teams for THIS tournament
                var tournamentTeamIds = registrations
                    .Where(r => r.TournamentId == tournament.Id)
                    .Select(r => r.TeamId)
                    .ToList();

                if (tournamentTeamIds.Count < 2) continue;

                // Get game for stream URLs
                var game = games.FirstOrDefault(g => g.Id == tournament.GameId);
                var channels = game != null && StreamChannels.TryGetValue(game.Name, out var ch)
                    ? ch
                    : new[] { "esl_esports" };

                // Tournament stages sorted by order
                var tournamentStages = stages
                    .Where(s => s.TournamentId == tournament.Id)
                    .OrderBy(s => s.Order)
                    .ToList();

                foreach (var stage in tournamentStages)
                {
                    // Number of matches depends on stage type
                    var matchCount = GetMatchCountForStage(stage.StageType, tournamentTeamIds.Count);

                    for (int i = 0; i < matchCount; i++)
                    {
                        // Pick 2 different teams
                        var shuffled = tournamentTeamIds.OrderBy(_ => f.Random.Int()).ToList();
                        var team1Id = shuffled[0];
                        var team2Id = shuffled[1];

                        // Match date: distributed across tournament duration
                        var totalDays = (tournament.EndDate - tournament.StartDate).TotalDays;
                        var stageProgress = (stage.Order - 1) / (double)tournamentStages.Count;
                        var matchDate = tournament.StartDate.AddDays(stageProgress * totalDays)
                                                              .AddHours(f.Random.Int(0, 6));

                        // Determine winner based on tournament status
                        int? winnerId = null;
                        if (tournament.Status == TournamentStatus.Completed)
                        {
                            winnerId = f.Random.Bool() ? team1Id : team2Id;
                        }
                        else if (tournament.Status == TournamentStatus.Ongoing
                                 && stage.Order < tournamentStages.Count) // earlier stages done
                        {
                            winnerId = f.Random.Bool() ? team1Id : team2Id;
                        }

                        matches.Add(new Match(matchDate)
                        {
                            StageId = stage.Id,
                            Team1Id = team1Id,
                            Team2Id = team2Id,
                            WinnerId = winnerId,
                            StreamUrl = $"https://twitch.tv/{f.PickRandom(channels)}"
                        });
                    }
                }
            }

            return matches;
        }

        private static int GetMatchCountForStage(StageType stageType, int totalTeams) => stageType switch
        {
            StageType.Qualifier => Math.Min(8, totalTeams / 2),
            StageType.GroupStage => Math.Min(12, totalTeams),
            StageType.RoundOf16 => 8,
            StageType.QuarterFinal => 4,
            StageType.SemiFinal => 2,
            StageType.GrandFinal => 1,
            _ => 4
        };
    }
}