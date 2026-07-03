using Bogus;
using Nexus.Domain.Entities;
using Nexus.Domain.Enums;

namespace Nexus.Infrastructure.Seeders
{
    public class MatchSeeder
    {
        private static readonly Dictionary<string, string[]> StreamChannels = new()
        {
            ["Counter-Strike 2"] = new[] { "esl_csgo", "blastpremier", "pgl_esports" },
            ["League of Legends"] = new[] { "riotgames", "lolesports", "lec" },
            ["Valorant"] = new[] { "valorant", "valorantesports", "vct" },
            ["Dota 2"] = new[] { "dota2ti", "pgl_esports" },
            ["Rocket League"] = new[] { "rocketleague", "rlcs" },
            ["Overwatch 2"] = new[] { "playoverwatch", "owcs" },
            ["Rainbow Six Siege"] = new[] { "rainbow6", "blastr6" },
            ["StarCraft II"] = new[] { "esl_sc2" }
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
                var registeredTeamIds = registrations
                    .Where(r => r.TournamentId == tournament.Id)
                    .OrderBy(r => r.SeedNumber)
                    .Select(r => r.TeamId)
                    .ToList();

                if (registeredTeamIds.Count < 4) continue;

                var game = games.FirstOrDefault(g => g.Id == tournament.GameId);
                var channels = game != null && StreamChannels.TryGetValue(game.Name, out var ch)
                    ? ch
                    : new[] { "esl_esports" };

                var tournamentStages = stages
                    .Where(s => s.TournamentId == tournament.Id)
                    .OrderBy(s => s.Order)
                    .ToList();

                if (tournamentStages.Count == 0) continue;

                var totalDays = (tournament.EndDate - tournament.StartDate).TotalDays;

                // ─── Winners "pipeline" — after each stage, only winners advance ───
                var currentRoundTeams = registeredTeamIds.ToList();
                var stageIndex = 0;

                foreach (var stage in tournamentStages)
                {
                    var stageMatches = new List<Match>();

                    // Group stage = round-robin-style, doesn't eliminate — everyone plays
                    // Later rounds = knockout (winners advance)
                    var isGroupOrQualifier =
                        stage.StageType == StageType.GroupStage ||
                        stage.StageType == StageType.Qualifier;

                    if (isGroupOrQualifier)
                    {
                        // Every team plays ~2-3 matches, doesn't eliminate
                        var groupMatchCount = Math.Min(currentRoundTeams.Count, 12);
                        for (int i = 0; i < groupMatchCount; i++)
                        {
                            var shuffled = currentRoundTeams.OrderBy(_ => f.Random.Int()).ToList();
                            var team1Id = shuffled[0];
                            var team2Id = shuffled[1];

                            var matchDate = GetMatchDate(tournament, stageIndex, tournamentStages.Count, totalDays, f);
                            var winnerId = DetermineWinner(tournament, stage, tournamentStages, team1Id, team2Id, f);

                            stageMatches.Add(new Match(matchDate)
                            {
                                StageId = stage.Id,
                                Team1Id = team1Id,
                                Team2Id = team2Id,
                                WinnerId = winnerId,
                                StreamUrl = $"https://twitch.tv/{f.PickRandom(channels)}"
                            });
                        }

                        // After group stage, top 8 (or all) advance — pick top half by seed
                        var topHalf = currentRoundTeams.Take(Math.Max(8, currentRoundTeams.Count / 2)).ToList();
                        currentRoundTeams = topHalf;
                    }
                    else
                    {
                        // Knockout: pair up teams, 1 match each, winners advance
                        var matchCount = currentRoundTeams.Count / 2;
                        var winners = new List<int>();

                        for (int i = 0; i < matchCount; i++)
                        {
                            var team1Id = currentRoundTeams[i * 2];
                            var team2Id = currentRoundTeams[i * 2 + 1];

                            var matchDate = GetMatchDate(tournament, stageIndex, tournamentStages.Count, totalDays, f);
                            var winnerId = DetermineWinner(tournament, stage, tournamentStages, team1Id, team2Id, f);

                            stageMatches.Add(new Match(matchDate)
                            {
                                StageId = stage.Id,
                                Team1Id = team1Id,
                                Team2Id = team2Id,
                                WinnerId = winnerId,
                                StreamUrl = $"https://twitch.tv/{f.PickRandom(channels)}"
                            });

                            // Only advance if this match was actually played
                            if (winnerId.HasValue)
                                winners.Add(winnerId.Value);
                            else
                                winners.Add(f.Random.Bool() ? team1Id : team2Id); // placeholder
                        }

                        currentRoundTeams = winners;
                    }

                    matches.AddRange(stageMatches);
                    stageIndex++;
                }
            }

            return matches;
        }

        private DateTime GetMatchDate(Tournament t, int stageIdx, int totalStages, double totalDays, Faker f)
        {
            var progress = stageIdx / (double)totalStages;
            return t.StartDate.AddDays(progress * totalDays).AddHours(f.Random.Int(0, 6));
        }

        private int? DetermineWinner(Tournament t, Stage stage, List<Stage> allStages, int team1Id, int team2Id, Faker f)
        {
            // Completed tournaments: all matches have winners
            if (t.Status == TournamentStatus.Completed)
                return f.Random.Bool() ? team1Id : team2Id;

            // Upcoming: no winners yet
            if (t.Status == TournamentStatus.Upcoming)
                return null;

            // Ongoing: group + qualifier stages are done, others depend on stage.Order
            if (stage.StageType == StageType.GroupStage || stage.StageType == StageType.Qualifier)
                return f.Random.Bool() ? team1Id : team2Id;

            // Ongoing = only the LAST stage is still pending
            var isLastStage = stage.Order == allStages.Count;
            if (isLastStage) return null;

            return f.Random.Bool() ? team1Id : team2Id;
        }
    }
}