import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/layout_template';
import PlayerStatsCharts from './player_stats_charts.jsx';
import PlayersService from '@/api/players_service';
import { LoadingState, EmptyState } from '@/components/ui/states';

const backLink = "inline-flex items-center gap-2 text-text-secondary font-heading text-[0.85rem] uppercase tracking-[0.1em] no-underline mb-6 relative z-[1] transition-all duration-150 hover:text-neon-cyan hover:gap-3 hover:no-underline";
const detailItem = "flex items-center gap-3";
const detailIcon = "text-xl text-neon-cyan";
const detailLabel = "font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted";
const detailValue = "font-semibold text-text-primary text-[0.95rem]";
const summaryCard = "glass-card text-center p-7";
const summaryValue = "font-heading text-[2.25rem] font-bold text-text-primary leading-none mb-2";
const summaryLabel = "font-heading text-xs tracking-[0.15em] uppercase text-text-secondary mb-2";
const summaryAvg = "text-xs text-text-muted";

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
                <LoadingState label="Loading player..." />
            </Layout>
        );
    }

    if (!player) {
        return (
            <Layout>
                <EmptyState icon="bi-person-x" title="Player not found">
                    <Link to="/players" className="btn-neon mt-4 inline-block">Back to Players</Link>
                </EmptyState>
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
            <Link to="/players" viewTransition className={backLink}>
                <i className="bi bi-arrow-left"></i> All Players
            </Link>

            {/* ───── Profile Hero ───── */}
            <section className="glass-card fade-in-up flex gap-10 p-10 mb-8 items-center flex-wrap">
                <div className="shrink-0 w-[200px] h-[200px] rounded-lg overflow-hidden border-2 border-border-glow shadow-glow-cyan relative">
                    {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.gamertag} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[5rem] text-text-muted bg-bg-tertiary">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                </div>

                <div className="grow min-w-[280px]">
                    <span className="badge-neon badge-violet">{player.role}</span>
                    <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold mt-2 mb-1 tracking-[-0.02em] text-glow">{player.gamertag}</h1>
                    <p className="text-text-secondary text-[1.1rem] italic mb-6">{player.realName}</p>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div className={detailItem}>
                            <i className={`bi bi-shield-fill ${detailIcon}`}></i>
                            <div className="flex flex-col">
                                <span className={detailLabel}>Team</span>
                                <span className={detailValue}>{player.teamName}</span>
                            </div>
                        </div>
                        <div className={detailItem}>
                            <i className={`bi bi-geo-alt-fill ${detailIcon}`}></i>
                            <div className="flex flex-col">
                                <span className={detailLabel}>Country</span>
                                <span>{player.countryName} {player.countryFlag ? (
                                    <img src={player.countryFlag} alt={player.countryName} className="w-6 h-[18px] object-cover rounded-[3px] border border-border-default inline-block align-middle" />
                                ) : (
                                    <i className="bi bi-geo-alt-fill"></i>
                                )}</span>
                            </div>
                        </div>
                        <div className={detailItem}>
                            <i className={`bi bi-cake2-fill ${detailIcon}`}></i>
                            <div className="flex flex-col">
                                <span className={detailLabel}>Age</span>
                                <span className={detailValue}>{age} ({player.yearOfBirth})</span>
                            </div>
                        </div>
                        <div className={detailItem}>
                            <i className={`bi bi-cash-stack ${detailIcon}`}></i>
                            <div className="flex flex-col">
                                <span className={detailLabel}>Salary</span>
                                <span className={`${detailValue} !text-neon-green`}>
                                    ${player.salary?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Stats Summary ───── */}
            <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-12 fade-in-up">
                <div className={summaryCard}>
                    <i className="bi bi-crosshair2 text-[2rem] mb-3 block text-neon-pink"></i>
                    <div className={summaryValue}>{totals.kills}</div>
                    <div className={summaryLabel}>Total Kills</div>
                    <div className={summaryAvg}>{avg('kills')} avg/match</div>
                </div>
                <div className={summaryCard}>
                    <i className="bi bi-x-octagon-fill text-[2rem] mb-3 block text-text-muted"></i>
                    <div className={summaryValue}>{totals.deaths}</div>
                    <div className={summaryLabel}>Total Deaths</div>
                    <div className={summaryAvg}>{avg('deaths')} avg/match</div>
                </div>
                <div className={summaryCard}>
                    <i className="bi bi-people-fill text-[2rem] mb-3 block text-neon-cyan"></i>
                    <div className={summaryValue}>{totals.assists}</div>
                    <div className={summaryLabel}>Total Assists</div>
                    <div className={summaryAvg}>{avg('assists')} avg/match</div>
                </div>
                <div className={summaryCard}>
                    <i className="bi bi-graph-up-arrow text-[2rem] mb-3 block text-neon-green"></i>
                    <div className={summaryValue}>{kd}</div>
                    <div className={summaryLabel}>K/D Ratio</div>
                    <div className={summaryAvg}>{totalMatches} matches</div>
                </div>
            </section>

            {/* ───── Charts ───── */}
            <PlayerStatsCharts stats={stats} />

            {/* ───── Achievements ───── */}
            {player.achievements?.length > 0 && (
                <section className="mt-12">
                    <h2 className="flex items-center gap-3 text-2xl font-semibold mb-6 tracking-[-0.02em]">
                        <i className="bi bi-trophy-fill text-neon-yellow"></i>
                        Achievements
                    </h2>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                        {player.achievements.map(a => (
                            <div key={a.id} className="glass-card flex items-center gap-4 p-5">
                                <i className="bi bi-award-fill text-[1.75rem] text-neon-yellow [text-shadow:0_0_15px_rgba(255,215,0,0.4)]"></i>
                                <div>
                                    <h4 className="text-[0.95rem] font-semibold text-text-primary mb-1">{a.title}</h4>
                                    <span className="text-[0.8rem] text-text-muted">{a.date}</span>
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
