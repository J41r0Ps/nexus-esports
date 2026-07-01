function TournamentTeams({ teams }) {
    if (!teams || teams.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-shield empty-icon"></i>
                <h3>No registered teams</h3>
                <p>Teams will appear here once they register.</p>
            </div>
        );
    }

    const sorted = [...teams].sort((a, b) => a.seedNumber - b.seedNumber);

    return (
        <div className="registered-teams-grid fade-in-up">
            {sorted.map(team => (
                <div key={team.teamId} className="registered-team-card glass-card">
                    <div className="seed-number">#{team.seedNumber}</div>

                    {team.teamFlag && (
                        <img
                            src={team.teamFlag}
                            alt={team.teamName}
                            className="registered-team-flag"
                        />
                    )}

                    <div className="registered-team-info">
                        <h4>{team.teamName}</h4>
                        <span className="registered-team-tag">[{team.teamTag}]</span>
                    </div>
                    <div className="registered-team-date">
                        <i className="bi bi-calendar3"></i>
                        {team.registeredAt}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TournamentTeams;