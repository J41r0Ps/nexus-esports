import { Link } from 'react-router-dom';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/states';
import CardAdminActions from '@/components/ui/card_admin_actions';
import { statusOf } from '@/lib/tournament_status';
import { formatMoney, humanize } from '@/lib/format';

const metaRow = "flex items-center gap-2 text-text-secondary text-[0.85rem] mb-2";
const gridCls = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-14";

function TournamentCard({ tournament, isAdmin, onEdit, onDelete, delay }) {
    const status = statusOf(tournament.status);

    return (
        <Link to={`/tournaments/${tournament.id}`} viewTransition className="block no-underline text-inherit hover:no-underline">
            <div className="group glass-card fade-in-up relative overflow-hidden flex flex-col h-full" style={{ animationDelay: `${delay}s` }}>
                {isAdmin && <CardAdminActions item={tournament} onEdit={onEdit} onDelete={onDelete} />}

                <div className={`h-1 ${status.stripe}`}></div>

                <div className="flex items-center justify-between pt-5 px-5 sm:px-6 pb-2">
                    <span className={`badge-neon ${status.badge}`}>
                        <i className={`bi ${status.icon} me-1`}></i>
                        {status.label}
                    </span>
                    <span className="font-heading text-[1.4rem] font-bold bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent tracking-[-0.02em]">{formatMoney(tournament.prizePool)}</span>
                </div>

                <div className="pt-2 px-5 sm:px-6 pb-6 grow">
                    <div className="inline-flex items-center gap-[0.4rem] text-neon-cyan font-heading text-[0.8rem] font-medium tracking-[0.1em] uppercase mb-2">
                        <i className="bi bi-controller"></i>
                        {tournament.gameName}
                    </div>
                    <h3 className="text-[1.3rem] font-bold text-text-primary mb-4 leading-[1.3] tracking-[-0.01em]">{tournament.name}</h3>

                    <div className={metaRow}>
                        <i className="bi bi-diagram-3-fill text-text-muted w-4"></i>
                        {humanize(tournament.format)}
                    </div>

                    <div className={metaRow}>
                        <i className="bi bi-calendar-range text-text-muted w-4"></i>
                        <span>{tournament.startDate} → {tournament.endDate}</span>
                    </div>

                    <div className="flex gap-6 mt-4 pt-4 border-t border-border-default">
                        <div className="flex items-center gap-[0.4rem] text-text-secondary text-[0.85rem]">
                            <i className="bi bi-shield-fill text-text-muted"></i>
                            <span>{tournament.totalTeams ?? 0} teams</span>
                        </div>
                        <div className="flex items-center gap-[0.4rem] text-text-secondary text-[0.85rem]">
                            <i className="bi bi-diagram-3 text-text-muted"></i>
                            <span>{tournament.totalStages ?? 0} stages</span>
                        </div>
                    </div>
                </div>

                <div className="py-4 px-5 sm:px-6 border-t border-border-default bg-[rgba(0,240,255,0.03)]">
                    <span className="flex items-center justify-between text-neon-cyan font-heading text-[0.85rem] font-medium uppercase tracking-[0.1em] transition-[gap] duration-[250ms] group-hover:gap-4">
                        View details <i className="bi bi-arrow-right transition-transform duration-[250ms] group-hover:translate-x-1.5"></i>
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
            {tournaments.map((t, i) => (
                <TournamentCard key={t.id} tournament={t} delay={Math.min(i * 0.05, 0.4)}
                    isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default TournamentsList;
