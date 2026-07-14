import { Link } from 'react-router-dom';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/states';
import CardAdminActions from '@/components/ui/card_admin_actions';

const metaItem = "flex items-center gap-[0.6rem] text-text-secondary text-[0.85rem]";
const metaIcon = "text-neon-violet text-[0.95rem] w-4";
const flagClass = "w-6 h-[18px] object-cover rounded-[3px] border border-border-default shrink-0";
const gridCls = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-14";

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
        <Link to={`/players/${player.id}`} viewTransition className="block no-underline text-inherit hover:no-underline">
            <div className="group glass-card fade-in-up relative flex flex-col overflow-hidden cursor-pointer before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-neon-violet before:to-neon-pink before:opacity-0 before:z-[2] before:transition-opacity before:duration-[250ms] group-hover:before:opacity-100">
                {isAdmin && <CardAdminActions item={player} onEdit={onEdit} onDelete={onDelete} />}

                <div className="relative w-full h-[200px] bg-bg-tertiary overflow-hidden">
                    {player.photoUrl ? (
                        <img src={player.photoUrl} alt={player.gamertag} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[250ms] group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[4rem] text-text-muted bg-gradient-to-br from-bg-secondary to-bg-tertiary">
                            <i className="bi bi-person-fill"></i>
                        </div>
                    )}
                    <span className={`badge-neon ${roleColors[player.role] || 'badge-neon'} absolute top-3 right-3 backdrop-blur-[10px]`}>
                        {player.role}
                    </span>
                </div>

                <div className="pt-5 px-6 pb-6">
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-1 tracking-[-0.01em]">{player.gamertag}</h3>
                    <p className="text-text-muted text-[0.85rem] mb-4 italic">{player.realName}</p>

                    <div className="flex flex-col gap-2 pt-4 border-t border-border-default">
                        <div className={metaItem}>
                            <i className={`bi bi-shield-fill ${metaIcon}`}></i>
                            <span>{player.teamName}</span>
                        </div>
                        <div className={metaItem}>
                            {player.countryFlag ? (
                                <img src={player.countryFlag} alt={player.countryName} width="24" height="18" loading="lazy" decoding="async" className={flagClass} />
                            ) : (
                                <i className={`bi bi-geo-alt-fill ${metaIcon}`}></i>
                            )}
                            <span>{player.countryName}</span>
                        </div>
                        <div className={`${metaItem} mt-1 !text-neon-green font-semibold font-heading`}>
                            <i className="bi bi-cash-stack text-[0.95rem] w-4 text-neon-green"></i>
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
        return <SkeletonGrid count={12} height={340} className={gridCls} />;
    }

    if (players.length === 0) {
        return (
            <EmptyState icon="bi-search" title="No players found" description="Try adjusting your filters or search query." />
        );
    }

    return (
        <div className={gridCls}>
            {players.map(player => (
                <PlayerCard key={player.id} player={player}
                    isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default PlayersList;
