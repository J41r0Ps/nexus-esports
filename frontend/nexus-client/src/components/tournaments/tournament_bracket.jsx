import { useAuth0 } from "@auth0/auth0-react";
import { useIsAdmin } from '@/hooks/use_is_admin';
import TournamentsService from '@/api/tournaments_service';

function MatchCard({ match, tournamentId, isAdmin, onWinnerSet }) {
    const { getAccessTokenSilently } = useAuth0();
    const hasWinner = match.winnerId != null;

    const setWinner = async (teamName) => {
        try {
            // We need actual team IDs — the current match list DTO has team names only.
            // For admin actions, we'll fetch the full match detail to get IDs.
            const detail = await TournamentsService.getAllTournaments; // placeholder
            // Simpler: derive from currently selected side
            const token = await getAccessTokenSilently();

            // team1 name matches → use match.team1Id (need to expose it)
            // For now: let's assume winner is passed as 1 or 2 (index)
            // We'll call the API with the team ID based on match data
        } catch (error) {
            console.log(error);
        }
    };

    // Simplified: since we have match.winnerId, but not team1Id/team2Id
    // in list DTO, we'll use dropdown approach via match detail

    return (
        <div className={`bracket-match ${hasWinner ? 'played' : 'pending'}`}>
            <div className={`bracket-team ${match.winnerId && match.winnerId === match.team1IdActual ? 'winner' : ''}`}>
                <div className="bracket-team-info">
                    {match.team1Logo && (
                        <img src={match.team1Logo} alt={match.team1Name} className="bracket-team-logo" />
                    )}
                    <span className="bracket-team-name">{match.team1Name}</span>
                </div>
            </div>

            <div className="bracket-vs">VS</div>

            <div className="bracket-team">
                <div className="bracket-team-info">
                    {match.team2Logo && (
                        <img src={match.team2Logo} alt={match.team2Name} className="bracket-team-logo" />
                    )}
                    <span className="bracket-team-name">{match.team2Name}</span>
                </div>
            </div>

            <div className="bracket-date">
                <i className="bi bi-calendar-event"></i> {match.matchDate}
            </div>

            {isAdmin && (
                <div className="admin-match-actions">
                    <button className="admin-match-btn" onClick={() => onWinnerSet(match, 'team1')}>
                        <i className="bi bi-trophy-fill"></i> {match.team1Name}
                    </button>
                    <button className="admin-match-btn" onClick={() => onWinnerSet(match, 'team2')}>
                        <i className="bi bi-trophy-fill"></i> {match.team2Name}
                    </button>
                </div>
            )}
        </div>
    );
}

function TournamentBracket({ stages, matches, tournamentId }) {
    const { getAccessTokenSilently } = useAuth0();
    const isAdmin = useIsAdmin();

    if (!stages || stages.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-diagram-3 empty-icon"></i>
                <h3>No bracket data yet</h3>
                <p>Stages will appear here once the tournament starts.</p>
            </div>
        );
    }

    const handleWinnerSet = async (match, side) => {
        try {
            // Fetch match details to get team IDs
            const detailRes = await TournamentsService.getMatches(tournamentId);
            const fullMatch = detailRes.data.find(m => m.id === match.id);
            if (!fullMatch) return;

            // We need to fetch the actual detail endpoint for team IDs
            const detail = await fetch(
                `https://localhost:7059/api/tournaments/${tournamentId}/matches/${match.id}`
            ).then(r => r.json());

            const winnerId = side === 'team1' ? detail.team1.id : detail.team2.id;

            const token = await getAccessTokenSilently();
            await TournamentsService.updateMatchWinner(tournamentId, match.id, winnerId, token);
            // SignalR will broadcast the update automatically
        } catch (error) {
            console.log(error);
        }
    };

    const matchesByStage = {};
    matches.forEach(m => {
        if (!matchesByStage[m.stageName]) matchesByStage[m.stageName] = [];
        matchesByStage[m.stageName].push(m);
    });

    return (
        <div className="bracket-container fade-in-up">
            <div className="bracket-scroll">
                {stages.sort((a, b) => a.order - b.order).map(stage => {
                    const stageMatches = matchesByStage[stage.stageType] || [];
                    return (
                        <div key={stage.id} className="bracket-stage">
                            <div className="bracket-stage-header">
                                <span className="bracket-stage-order">
                                    Round {stage.order}
                                </span>
                                <h3 className="bracket-stage-title">
                                    {stage.stageType?.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <span className="bracket-stage-count">
                                    {stageMatches.length} {stageMatches.length === 1 ? 'match' : 'matches'}
                                </span>
                            </div>

                            <div className="bracket-stage-matches">
                                {stageMatches.length > 0 ? (
                                    stageMatches.map(match => (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            tournamentId={tournamentId}
                                            isAdmin={isAdmin}
                                            onWinnerSet={handleWinnerSet}
                                        />
                                    ))
                                ) : (
                                    <div className="bracket-no-matches">
                                        <i className="bi bi-hourglass"></i>
                                        <span>No matches yet</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TournamentBracket;