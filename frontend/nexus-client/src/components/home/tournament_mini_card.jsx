import { Link } from 'react-router-dom';

const statusConfig = {
    Upcoming: { color: 'badge-yellow', stripe: 'bg-gradient-to-r from-neon-yellow to-neon-cyan' },
    Ongoing: { color: 'badge-green', stripe: 'bg-gradient-to-r from-neon-green to-neon-cyan' },
    Completed: { color: 'badge-violet', stripe: 'bg-gradient-to-r from-neon-violet to-neon-pink' },
    Cancelled: { color: 'badge-pink', stripe: 'bg-gradient-to-r from-neon-pink to-[#808080]' },
};

const formatPrize = (prize) => {
    if (prize >= 1000000) return `$${(prize / 1000000).toFixed(1)}M`;
    if (prize >= 1000) return `$${(prize / 1000).toFixed(0)}K`;
    return `$${prize}`;
};

/**
 * Compact tournament card for the home page's featured grid — a lighter
 * variant of the full card in tournaments_list (no admin actions, less meta).
 */
function TournamentMiniCard({ tournament }) {
    const status = statusConfig[tournament.status] || statusConfig.Upcoming;

    return (
        <Link to={`/tournaments/${tournament.id}`} viewTransition className="block h-full no-underline text-inherit hover:no-underline">
            <div className="group glass-card overflow-hidden h-full flex flex-col">
                <div className={`h-1 ${status.stripe}`}></div>

                <div className="p-6 grow">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <span className={`badge-neon ${status.color}`}>{tournament.status}</span>
                        <span className="font-heading text-[1.2rem] font-bold bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent tracking-[-0.02em]">
                            {formatPrize(tournament.prizePool)}
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-[0.4rem] text-neon-cyan font-heading text-[0.78rem] font-medium tracking-[0.1em] uppercase mb-1">
                        <i className="bi bi-controller"></i>
                        {tournament.gameName}
                    </div>
                    <h3 className="text-[1.15rem] font-bold text-text-primary leading-snug tracking-[-0.01em] mb-3">
                        {tournament.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-text-secondary text-[0.83rem]">
                        <span className="inline-flex items-center gap-[0.4rem]">
                            <i className="bi bi-calendar-range text-neon-violet"></i>
                            {tournament.startDate}
                        </span>
                        <span className="inline-flex items-center gap-[0.4rem]">
                            <i className="bi bi-shield-fill text-neon-violet"></i>
                            {tournament.totalTeams ?? 0} teams
                        </span>
                    </div>
                </div>

                <div className="py-3 px-6 border-t border-border-default bg-[rgba(0,240,255,0.03)]">
                    <span className="flex items-center justify-between text-neon-cyan font-heading text-[0.8rem] font-medium uppercase tracking-[0.1em] transition-[gap] duration-[250ms] group-hover:gap-4">
                        View details <i className="bi bi-arrow-right transition-transform duration-[250ms] group-hover:translate-x-1.5"></i>
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default TournamentMiniCard;
