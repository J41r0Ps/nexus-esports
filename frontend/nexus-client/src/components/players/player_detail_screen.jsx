import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/layout_template';
import PlayerStatsCharts from './player_stats_charts.jsx';
import PlayersService from '@/api/players_service';

function PlayerDetailScreen() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPlayer = async () => {
            try {
                setLoading(true);
                const result = await PlayersService.getPlayerById(id);
                setPlayer(result.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getPlayer();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading player...</p>
                </div>
            </Layout>
        );
    }

    if (!player) {
        return (
            <Layout>
                <div className="empty-state glass-card">
                    <i className="bi bi-person-x empty-icon"></i>
                    <h3>Player not found</h3>
                    <Link to="/players" className="btn-neon mt-3">Back to Players</Link>
                </div>
            </Layout>
        );
    }

    const stats = player.playerStats || [];
    const totalMatches = stats.length;

    const avg = (key) => totalMatches === 0 ? 0 :
        (stats.reduce((sum, s) => sum + (s[key] || 0), 0) / totalMatches).toFixed(1);

    const totals = {
        kills: stats.reduce((s, x) => s + x.kills, 0),
        deaths: stats.reduce((s, x) => s + x.deaths, 0),
        assists: stats.reduce((s, x) => s + x.assists, 0),
    };

    const kd = totals.deaths === 0 ? totals.kills : (totals.kills / totals.deaths).toFixed(2);
    const age = new Date().getFullYear() - player.yearOfBirth;

    return (
        <Layout>
            <Link to="/players" className="back-link">
                <i className="bi bi-arrow-left"></i> All Players
            </Link>

            {/* ───── Profile Hero ───── */}
            <section className="player-hero glass-card fade-in-up">
                <div className="player-hero-photo">
                    {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.gamertag} />
                    ) : (
                        <div className="player-hero-placeholder">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                </div>

                <div className="player-hero-info">
                    <span className="badge-neon badge-violet">{player.role}</span>
                    <h1 className="player-hero-name text-glow">{player.gamertag}</h1>
                    <p className="player-hero-realname">{player.realName}</p>

                    <div className="player-hero-details">
                        <div className="player-detail-item">
                            <i className="bi bi-shield-fill"></i>
                            <div>
                                <span className="detail-label">Team</span>
                                <span className="detail-value">{player.teamName}</span>
                            </div>
                        </div>
                        <div className="player-detail-item">
                            <i className="bi bi-geo-alt-fill"></i>
                            <div>
                                <span className="detail-label">Country</span>
                                <span className="detail-value">{player.countryName}</span>
                            </div>
                        </div>
                        <div className="player-detail-item">
                            <i className="bi bi-cake2-fill"></i>
                            <div>
                                <span className="detail-label">Age</span>
                                <span className="detail-value">{age} ({player.yearOfBirth})</span>
                            </div>
                        </div>
                        <div className="player-detail-item">
                            <i className="bi bi-cash-stack"></i>
                            <div>
                                <span className="detail-label">Salary</span>
                                <span className="detail-value text-green">
                                    ${player.salary?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Stats Summary ───── */}
            <section className="stats-summary fade-in-up">
                <div className="summary-card glass-card">
                    <i className="bi bi-crosshair2 summary-icon" style={{ color: 'var(--neon-pink)' }}></i>
                    <div className="summary-value">{totals.kills}</div>
                    <div className="summary-label">Total Kills</div>
                    <div className="summary-avg">{avg('kills')} avg/match</div>
                </div>
                <div className="summary-card glass-card">
                    <i className="bi bi-x-octagon-fill summary-icon" style={{ color: 'var(--text-muted)' }}></i>
                    <div className="summary-value">{totals.deaths}</div>
                    <div className="summary-label">Total Deaths</div>
                    <div className="summary-avg">{avg('deaths')} avg/match</div>
                </div>
                <div className="summary-card glass-card">
                    <i className="bi bi-people-fill summary-icon" style={{ color: 'var(--neon-cyan)' }}></i>
                    <div className="summary-value">{totals.assists}</div>
                    <div className="summary-label">Total Assists</div>
                    <div className="summary-avg">{avg('assists')} avg/match</div>
                </div>
                <div className="summary-card glass-card">
                    <i className="bi bi-graph-up-arrow summary-icon" style={{ color: 'var(--neon-green)' }}></i>
                    <div className="summary-value">{kd}</div>
                    <div className="summary-label">K/D Ratio</div>
                    <div className="summary-avg">{totalMatches} matches</div>
                </div>
            </section>

            {/* ───── Charts ───── */}
            <PlayerStatsCharts stats={stats} />

            {/* ───── Achievements ───── */}
            {player.achievements?.length > 0 && (
                <section className="achievements-section">
                    <h2 className="section-title">
                        <i className="bi bi-trophy-fill" style={{ color: 'var(--neon-yellow)' }}></i>
                        Achievements
                    </h2>
                    <div className="achievements-grid">
                        {player.achievements.map(a => (
                            <div key={a.id} className="achievement-card glass-card">
                                <i className="bi bi-award-fill achievement-icon"></i>
                                <div>
                                    <h4>{a.title}</h4>
                                    <span className="achievement-date">{a.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default PlayerDetailScreen;