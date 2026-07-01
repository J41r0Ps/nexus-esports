function MatchCard({ match }) {
    const isWinner = (teamId) => match.winnerId === teamId;
    const hasWinner = match.winnerId != null;

    // Find team IDs from match (we have winnerId)
    // The list endpoint gives us names but not ids in PlayerStats - let's deduce winner by name
    return (
        <div className={`bracket-match ${hasWinner ? 'played' : 'pending'}`}>
            <div className={`bracket-team ${isWinner ? 'winner' : ''}`}>
                <div className="bracket-team-info">
                    {match.team1Logo && (
                        <img src={match.team1Logo} alt={match.team1Name} className="bracket-team-logo" />
                    )}
                    <span className="bracket-team-name">{match.team1Name}</span>
                </div>
                {hasWinner && (
                    <i className={`bi ${isWinner ? 'bi-check-circle-fill' : 'bi-x-circle'}`}></i>
                )}
            </div>

            <div className="bracket-vs">VS</div>

            <div className={`bracket-team ${isWinner ? 'winner' : ''}`}>
                <div className="bracket-team-info">
                    {match.team2Logo && (
                        <img src={match.team2Logo} alt={match.team2Name} className="bracket-team-logo" />
                    )}
                    <span className="bracket-team-name">{match.team2Name}</span>
                </div>
                {hasWinner && (
                    <i className={`bi ${isWinner ? 'bi-check-circle-fill' : 'bi-x-circle'}`}></i>
                )}
            </div>

            <div className="bracket-date">
                <i className="bi bi-calendar-event"></i> {match.matchDate}
            </div>
        </div>
    );
}

function TournamentBracket({ stages, matches }) {
    if (!stages || stages.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-diagram-3 empty-icon"></i>
                <h3>No bracket data yet</h3>
                <p>Stages will appear here once the tournament starts.</p>
            </div>
        );
    }

    // Group matches by stage
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
                                        <MatchCard key={match.id} match={match} />
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