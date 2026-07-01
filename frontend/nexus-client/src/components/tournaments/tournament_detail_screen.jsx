import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/layout_template';
import TournamentBracket from './tournament_bracket';
import TournamentTeams from './tournament_teams';
import TournamentsService from '@/api/tournaments_service';

function TournamentDetailScreen() {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('bracket');
    const [loading, setLoading] = useState(true);

    const getTournament = async () => {
        try {
            setLoading(true);
            const result = await TournamentsService.getTournamentById(id);
            setTournament(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getMatches = async () => {
        try {
            const result = await TournamentsService.getMatches(id);
            setMatches(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTournament();
        getMatches();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading tournament...</p>
                </div>
            </Layout>
        );
    }

    if (!tournament) {
        return (
            <Layout>
                <div className="empty-state glass-card">
                    <i className="bi bi-trophy empty-icon"></i>
                    <h3>Tournament not found</h3>
                    <Link to="/tournaments" className="btn-neon mt-3">
                        Back to Tournaments
                    </Link>
                </div>
            </Layout>
        );
    }

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
        <Layout>
            {/* ─────── Hero Banner ─────── */}
            <section className="tournament-hero fade-in-up">
                <Link to="/tournaments" className="back-link">
                    <i className="bi bi-arrow-left"></i> All Tournaments
                </Link>

                <div className="tournament-hero-content">
                    <div className="tournament-hero-meta">
                        <span className={`badge-neon ${status.color}`}>
                            <i className={`bi ${status.icon} me-1`}></i>
                            {tournament.status}
                        </span>
                        <span className="tournament-hero-game">
                            <i className="bi bi-controller"></i> {tournament.gameName}
                        </span>
                    </div>

                    <h1 className="tournament-hero-title text-glow">
                        {tournament.name}
                    </h1>

                    <div className="tournament-hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-label">Prize Pool</span>
                            <span className="hero-stat-value hero-stat-prize">
                                {formatPrize(tournament.prizePool)}
                            </span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-label">Format</span>
                            <span className="hero-stat-value">
                                {tournament.format?.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-label">Start Date</span>
                            <span className="hero-stat-value">{tournament.startDate}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-label">End Date</span>
                            <span className="hero-stat-value">{tournament.endDate}</span>
                        </div>
                        <div className="hero-stat">
                            <span className="hero-stat-label">Teams</span>
                            <span className="hero-stat-value">
                                {tournament.registeredTeams?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────── Tabs ─────── */}
            <div className="tournament-tabs">
                <button
                    className={`tournament-tab ${activeTab === 'bracket' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bracket')}
                >
                    <i className="bi bi-diagram-3-fill"></i> Bracket
                </button>
                <button
                    className={`tournament-tab ${activeTab === 'teams' ? 'active' : ''}`}
                    onClick={() => setActiveTab('teams')}
                >
                    <i className="bi bi-shield-fill"></i> Teams
                    <span className="tab-count">{tournament.registeredTeams?.length || 0}</span>
                </button>
            </div>

            {/* ─────── Tab Content ─────── */}
            {activeTab === 'bracket' && (
                <TournamentBracket stages={tournament.stages} matches={matches} />
            )}

            {activeTab === 'teams' && (
                <TournamentTeams teams={tournament.registeredTeams} />
            )}
        </Layout>
    );
}

export default TournamentDetailScreen;