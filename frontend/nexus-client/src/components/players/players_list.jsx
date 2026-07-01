import { Link } from 'react-router-dom';
import { SkeletonGrid } from '@/components/ui/skeleton';

function PlayerCard({ player, isAdmin, onEdit, onDelete }) {
    const roleColors = {
        Fragger: 'badge-pink', IGL: 'badge-violet', Support: 'badge-green',
        Sniper: 'badge-neon', Lurker: 'badge-yellow', Coach: 'badge-violet',
        Analyst: 'badge-neon', Substitute: 'badge-pink'
    };

    const formatSalary = (salary) => {
        if (salary >= 1000) return `$${(salary / 1000).toFixed(0)}K`;
        return `$${salary}`;
    };

    return (
        <Link to={`/players/${player.id}`} className="player-card-link">
            <div className="player-card glass-card fade-in-up">
                {isAdmin && (
                    <div className="admin-actions">
                        <button className="admin-btn admin-btn-edit"
                            onClick={(e) => { e.preventDefault(); onEdit(player); }}>
                            <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="admin-btn admin-btn-delete"
                            onClick={(e) => { e.preventDefault(); onDelete(player); }}>
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                )}

                <div className="player-card-image">
                    {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.gamertag} />
                    ) : (
                        <div className="player-card-placeholder">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                    <span className={`badge-neon player-role-badge ${roleColors[player.role] || 'badge-neon'}`}>
                        {player.role}
                    </span>
                </div>

                <div className="player-card-body">
                    <h3 className="player-gamertag">{player.gamertag}</h3>
                    <p className="player-realname">{player.realName}</p>

                    <div className="player-meta">
                        <div className="player-meta-item">
                            <i className="bi bi-shield-fill"></i>
                            <span>{player.teamName}</span>
                        </div>
                        <div className="player-meta-item">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{player.countryName}</span>
                        </div>
                        <div className="player-meta-item player-salary">
                            <i className="bi bi-cash-stack"></i>
                            <span>{formatSalary(player.salary)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function PlayersList({ players, loading, isAdmin, onEdit, onDelete }) {
    if (loading) {
        return <SkeletonGrid count={12} height={340} />;
    }

    if (players.length === 0) {
        return (
            <div className="empty-state glass-card">
                <i className="bi bi-search empty-icon"></i>
                <h3>No players found</h3>
                <p>Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="players-grid">
            {players.map(player => (
                <PlayerCard key={player.id} player={player}
                    isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default PlayersList;