function TeamCard({ team }) {
    const regionColors = {
        EU: 'badge-neon',
        NA: 'badge-violet',
        APAC: 'badge-pink',
        LATAM: 'badge-green',
        ME: 'badge-yellow',
        CIS: 'badge-neon',
        OCE: 'badge-violet'
    };

    return (
        <div className="team-card glass-card fade-in-up">
            <div className="team-card-header">
                <div className="team-logo">
                    {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} />
                    ) : (
                        <span>{team.tag?.charAt(0)}</span>
                    )}
                </div>
                <span className={`badge-neon ${regionColors[team.region] || 'badge-neon'}`}>
                    {team.region}
                </span>
            </div>

            <div className="team-card-body">
                <h3 className="team-name">{team.name}</h3>
                <span className="team-tag">[{team.tag}]</span>

                <div className="team-meta">
                    <div className="team-meta-item">
                        <i className="bi bi-controller"></i>
                        <span>{team.gameName}</span>
                    </div>
                    <div className="team-meta-item">
                        <i className="bi bi-calendar3"></i>
                        <span>Est. {team.foundedYear}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeamsList({ teams, loading }) {
    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading teams...</p>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-search empty-icon"></i>
                <h3>No teams found</h3>
                <p>Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="teams-grid">
            {teams.map(team => (
                <TeamCard key={team.id} team={team} />
            ))}
        </div>
    );
}

export default TeamsList;