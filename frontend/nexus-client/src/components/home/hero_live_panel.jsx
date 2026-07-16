import { Link } from 'react-router-dom';
import { SkeletonLine } from '@/components/ui/skeleton';
import { statusOf } from '@/lib/tournament_status';
import { formatMoney } from '@/lib/format';

/**
 * Hero showcase panel fed by real API data: the featured tournament (ongoing
 * first, else upcoming), its top-seeded registrations, the latest SignalR match
 * result, and the next scheduled event in the footer.
 */
function HeroLivePanel({ tournament, teams, nextUp, latestUpdate, loading }) {
    if (loading) {
        return (
            <div className="glass-card overflow-hidden">
                <div className="h-1 bg-[linear-gradient(90deg,var(--neon-cyan),var(--neon-violet),var(--neon-pink),var(--neon-cyan))] [background-size:200%_100%] animate-[gradientPan_8s_linear_infinite] motion-reduce:animate-none"></div>
                <div className="p-6 flex flex-col gap-4">
                    <SkeletonLine width="40%" height={24} />
                    <SkeletonLine width="80%" height={28} />
                    <SkeletonLine width="60%" height={16} />
                    <SkeletonLine width="100%" height={44} />
                    <SkeletonLine width="100%" height={44} />
                    <SkeletonLine width="100%" height={44} />
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="glass-card overflow-hidden">
                <div className="h-1 bg-[linear-gradient(90deg,var(--neon-cyan),var(--neon-violet),var(--neon-pink),var(--neon-cyan))] [background-size:200%_100%] animate-[gradientPan_8s_linear_infinite] motion-reduce:animate-none"></div>
                <div className="p-8 text-center">
                    <i className="bi bi-trophy text-4xl text-text-muted mb-3 block"></i>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">No tournaments yet</h3>
                    <p className="text-text-secondary text-[0.9rem] m-0">
                        Events will show up here as soon as they are created.
                    </p>
                </div>
            </div>
        );
    }

    const status = statusOf(tournament.status);
    const topSeeds = [...(teams || [])]
        .sort((a, b) => a.seedNumber - b.seedNumber)
        .slice(0, 3);
    const remaining = (teams?.length || 0) - topSeeds.length;

    return (
        <div className="glass-card overflow-hidden">
            <div className="h-1 bg-[linear-gradient(90deg,var(--neon-cyan),var(--neon-violet),var(--neon-pink),var(--neon-cyan))] [background-size:200%_100%] animate-[gradientPan_8s_linear_infinite] motion-reduce:animate-none"></div>

            <div className="p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`badge-neon ${status.badge} inline-flex items-center gap-2`}>
                        {tournament.status === 'Ongoing' && <span className="live-dot"></span>}
                        {status.label}
                    </span>
                    <span className="font-heading text-[1.3rem] font-bold bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent tracking-[-0.02em]">
                        {formatMoney(tournament.prizePool)}
                    </span>
                </div>

                <div className="inline-flex items-center gap-[0.4rem] text-neon-cyan font-heading text-[0.78rem] font-medium tracking-[0.1em] uppercase mb-1">
                    <i className="bi bi-controller"></i>
                    {tournament.gameName}
                </div>
                <Link
                    to={`/tournaments/${tournament.id}`}
                    viewTransition
                    className="block text-text-primary hover:text-neon-cyan no-underline text-[1.35rem] font-heading font-bold leading-tight tracking-[-0.01em] mb-2 transition-colors duration-200"
                >
                    {tournament.name}
                </Link>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-text-secondary text-[0.83rem] mb-4">
                    <span className="inline-flex items-center gap-[0.4rem]">
                        <i className="bi bi-calendar-range text-neon-violet"></i>
                        {tournament.startDate} → {tournament.endDate}
                    </span>
                    <span className="inline-flex items-center gap-[0.4rem]">
                        <i className="bi bi-shield-fill text-neon-violet"></i>
                        {tournament.totalTeams ?? 0} teams
                    </span>
                </div>

                {topSeeds.length > 0 && (
                    <div className="border-t border-border-default">
                        {topSeeds.map((team) => (
                            <div key={team.teamId} className="flex items-center gap-3 py-2.5 border-b border-border-default last:border-b-0">
                                <span className="font-heading font-bold text-neon-cyan text-[0.9rem] min-w-[28px]">
                                    #{team.seedNumber}
                                </span>
                                {team.teamFlag && (
                                    <img
                                        src={team.teamFlag}
                                        alt=""
                                        width="24"
                                        height="16"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-6 h-4 object-cover rounded-[3px] border border-border-default shrink-0"
                                    />
                                )}
                                <span className="text-text-primary text-[0.9rem] font-medium truncate">{team.teamName}</span>
                                <span className="font-heading text-text-muted text-[0.75rem] ml-auto">[{team.teamTag}]</span>
                            </div>
                        ))}
                        {remaining > 0 && (
                            <div className="pt-2 text-text-muted text-[0.8rem]">
                                +{remaining} more registered {remaining === 1 ? 'team' : 'teams'}
                            </div>
                        )}
                    </div>
                )}

                {latestUpdate && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-sm border border-neon-green/40 bg-neon-green/[0.06] px-3 py-2.5 text-[0.85rem] text-text-primary">
                        <span className="live-dot shrink-0"></span>
                        <span className="truncate">
                            <strong className="text-neon-green">{latestUpdate.winnerName}</strong> defeated{' '}
                            {latestUpdate.winnerName === latestUpdate.team1Name
                                ? latestUpdate.team2Name
                                : latestUpdate.team1Name}
                        </span>
                    </div>
                )}
            </div>

            <div className="py-3.5 px-6 border-t border-border-default bg-[rgba(0,240,255,0.03)] flex items-center justify-between gap-3">
                {nextUp ? (
                    <span className="text-text-secondary text-[0.83rem] truncate">
                        Next: <span className="text-text-primary font-medium">{nextUp.name}</span> · {nextUp.startDate}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 text-text-muted text-[0.8rem]">
                        <span className="live-dot"></span> Live over SignalR
                    </span>
                )}
                <Link
                    to={`/tournaments/${tournament.id}`}
                    viewTransition
                    className="inline-flex items-center gap-2 text-neon-cyan font-heading text-[0.8rem] font-medium uppercase tracking-[0.1em] no-underline shrink-0 hover:gap-3 transition-all duration-200"
                >
                    Open bracket <i className="bi bi-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
}

export default HeroLivePanel;
