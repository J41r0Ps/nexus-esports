import { Link } from 'react-router-dom';
import { SkeletonGrid } from '@/components/ui/skeleton';

function TournamentCard({ tournament, isAdmin, onEdit, onDelete }) {
    const statusConfig = {
        Upcoming: { color: 'badge-yellow', icon: 'bi-hourglass-split' },
        Ongoing: { color: 'badge-green', icon: 'bi-broadcast' },
        Completed: { color: 'badge-violet', icon: 'bi-check-circle-fill' },
        Cancelled: { color: 'badge-pink', icon: 'bi-x-circle-fill' }
    };

    const status = statusConfig[tournament.status] || statusConfig.Upcoming;

    const formatPrize = (prize) => {
        if (prize >= 1000000) return `$${(prize / 1000000).toFixed(1)}M`;
        if (prize >= 1000) return `$${(prize / 1000).toFixed(0)}K`;
        return `$${prize}`;
    };

    return (
        <Link to={`/tournaments/${tournament.id}`} className="tournament-card-link">
            <div className="tournament-card glass-card fade-in-up">
                {isAdmin && (
                    <div className="admin-actions">
                        <button className="admin-btn admin-btn-edit"
                            onClick={(e) => { e.preventDefault(); onEdit(tournament); }}>
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="admin-btn admin-btn-delete"
                            onClick={(e) => { e.preventDefault(); onDelete(tournament); }}>
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                )}

                <div className={`tournament-stripe stripe-${tournament.status?.toLowerCase()}`}></div>

                <div className="tournament-card-header">
                    <span className={`badge-neon ${status.color}`}>
                        <i className={`bi ${status.icon} me-1`}></i>
                        {tournament.status}
                    </span>
                    <span className="tournament-prize">{formatPrize(tournament.prizePool)}</span>
                </div>

                <div className="tournament-card-body">
                    <div className="tournament-game">
                        <i className="bi bi-controller"></i>
                        {tournament.gameName}
                    </div>
                    <h3 className="tournament-name">{tournament.name}</h3>

                    <div className="tournament-format">
                        <i className="bi bi-diagram-3-fill"></i>
                        {tournament.format?.replace(/([A-Z])/g, ' $1').trim()}
                    </div>

                    <div className="tournament-dates">
                        <i className="bi bi-calendar-range"></i>
                        <span>{tournament.startDate} → {tournament.endDate}</span>
                    </div>

                    <div className="tournament-stats">
                        <div className="tournament-stat">
                            <i className="bi bi-shield-fill"></i>
                            <span>{tournament.totalTeams ?? 0} Teams</span>
                        </div>
                        <div className="tournament-stat">
                            <i className="bi bi-diagram-3"></i>
                            <span>{tournament.totalStages ?? 0} Stages</span>
                        </div>
                    </div>
                </div>

                <div className="tournament-card-footer">
                    <span className="tournament-view">
                        View Details <i className="bi bi-arrow-right"></i>
                    </span>
                </div>
            </div>
        </Link>
    );
}

function TournamentsList({ tournaments, loading, isAdmin, onEdit, onDelete }) {
    if (loading) {
        return <SkeletonGrid count={9} height={360} />;
    }

    if (tournaments.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-trophy empty-icon"></i>
                <h3>No tournaments found</h3>
                <p>Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="tournaments-grid">
            {tournaments.map(t => (
                <TournamentCard key={t.id} tournament={t}
                    isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default TournamentsList;