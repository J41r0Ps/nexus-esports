import { Link } from 'react-router-dom';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/states';
import CardAdminActions from '@/components/ui/card_admin_actions';

const metaRow = "flex items-center gap-2 text-text-secondary text-[0.85rem] mb-2";
const gridCls = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-14";
const stripeColors = {
    upcoming: 'bg-gradient-to-r from-neon-yellow to-neon-cyan',
    ongoing: 'bg-gradient-to-r from-neon-green to-neon-cyan',
    completed: 'bg-gradient-to-r from-neon-violet to-neon-pink',
    cancelled: 'bg-gradient-to-r from-neon-pink to-[#808080]',
};

function TournamentCard({ tournament, isAdmin, onEdit, onDelete }) {
    const statusConfig = {
        Upcoming: { color: 'badge-yellow', icon: 'bi-hourglass-split' },
        Ongoing: { color: 'badge-green', icon: 'bi-broadcast' },
        Completed: { color: 'badge-violet', icon: 'bi-check-circle-fill' },
        Cancelled: { color: 'badge-pink', icon: 'bi-x-circle-fill' }
    };

    const status = statusConfig[tournament.status] || statusConfig.Upcoming;
    const stripe = stripeColors[tournament.status?.toLowerCase()] || 'bg-gradient-to-br from-neon-cyan to-neon-violet';

    const formatPrize = (prize) => {
        if (prize >= 1000000) return `$${(prize / 1000000).toFixed(1)}M`;
        if (prize >= 1000) return `$${(prize / 1000).toFixed(0)}K`;
        return `$${prize}`;
    };

    return (
        <Link to={`/tournaments/${tournament.id}`} viewTransition className="block no-underline text-inherit hover:no-underline">
            <div className="group glass-card fade-in-up relative overflow-hidden flex flex-col h-full">
                {isAdmin && <CardAdminActions item={tournament} onEdit={onEdit} onDelete={onDelete} />}

                <div className={`h-1 ${stripe}`}></div>

                <div className="flex items-center justify-between pt-5 px-6 pb-2">
                    <span className={`badge-neon ${status.color}`}>
                        <i className={`bi ${status.icon} me-1`}></i>
                        {tournament.status}
                    </span>
                    <span className="font-heading text-[1.4rem] font-bold bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent tracking-[-0.02em]">{formatPrize(tournament.prizePool)}</span>
                </div>

                <div className="pt-2 px-6 pb-6 grow">
                    <div className="inline-flex items-center gap-[0.4rem] text-neon-cyan font-heading text-[0.8rem] font-medium tracking-[0.1em] uppercase mb-2">
                        <i className="bi bi-controller"></i>
                        {tournament.gameName}
                    </div>
                    <h3 className="text-[1.3rem] font-bold text-text-primary mb-4 leading-[1.3] tracking-[-0.01em]">{tournament.name}</h3>

                    <div className={metaRow}>
                        <i className="bi bi-diagram-3-fill text-neon-violet w-4"></i>
                        {tournament.format?.replace(/([A-Z])/g, ' $1').trim()}
                    </div>

                    <div className={metaRow}>
                        <i className="bi bi-calendar-range text-neon-violet w-4"></i>
                        <span>{tournament.startDate} → {tournament.endDate}</span>
                    </div>

                    <div className="flex gap-6 mt-4 pt-4 border-t border-border-default">
                        <div className="flex items-center gap-[0.4rem] text-text-secondary text-[0.85rem]">
                            <i className="bi bi-shield-fill text-neon-cyan"></i>
                            <span>{tournament.totalTeams ?? 0} Teams</span>
                        </div>
                        <div className="flex items-center gap-[0.4rem] text-text-secondary text-[0.85rem]">
                            <i className="bi bi-diagram-3 text-neon-cyan"></i>
                            <span>{tournament.totalStages ?? 0} Stages</span>
                        </div>
                    </div>
                </div>

                <div className="py-4 px-6 border-t border-border-default bg-[rgba(0,240,255,0.03)]">
                    <span className="flex items-center justify-between text-neon-cyan font-heading text-[0.85rem] font-medium uppercase tracking-[0.1em] transition-[gap] duration-[250ms] group-hover:gap-4">
                        View Details <i className="bi bi-arrow-right transition-transform duration-[250ms] group-hover:translate-x-1.5"></i>
                    </span>
                </div>
            </div>
        </Link>
    );
}

function TournamentsList({ tournaments, loading, isAdmin, onEdit, onDelete }) {
    if (loading) {
        return <SkeletonGrid count={8} height={360} className={gridCls} />;
    }

    if (tournaments.length === 0) {
        return (
            <EmptyState icon="bi-trophy" title="No tournaments found" description="Try adjusting your filters or search query." />
        );
    }

    return (
        <div className={gridCls}>
            {tournaments.map(t => (
                <TournamentCard key={t.id} tournament={t}
                    isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default TournamentsList;
