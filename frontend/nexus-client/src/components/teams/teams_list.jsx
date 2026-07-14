import { SkeletonGrid } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/states';
import CardAdminActions from '@/components/ui/card_admin_actions';

const metaItem = "flex items-center gap-2 text-text-secondary text-[0.85rem]";
const metaIcon = "text-neon-cyan text-[0.95rem] w-4";
const flagClass = "w-6 h-[18px] object-cover rounded-[3px] border border-border-default shrink-0";
const gridCls = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-14";

function TeamCard({ team, isAdmin, onEdit, onDelete }) {
    const regionColors = {
        EU: 'badge-neon', NA: 'badge-violet', APAC: 'badge-pink',
        LATAM: 'badge-green', ME: 'badge-yellow', CIS: 'badge-neon', OCE: 'badge-violet'
    };

    return (
        <div className="group glass-card fade-in-up relative flex flex-col overflow-hidden cursor-pointer before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-neon-cyan before:to-neon-violet before:opacity-0 before:transition-opacity before:duration-[250ms] group-hover:before:opacity-100">
            {isAdmin && <CardAdminActions item={team} onEdit={onEdit} onDelete={onDelete} />}

            <div className="flex items-center justify-between pt-6 px-6 pb-2">
                <div className="w-[60px] h-[60px] rounded-md bg-bg-tertiary border border-border-default flex items-center justify-center overflow-hidden font-heading text-2xl font-bold text-neon-cyan shrink-0">
                    {team.logoUrl ? <img src={team.logoUrl} alt={team.name} width="60" height="60" loading="lazy" decoding="async" className="w-full h-full object-contain p-1 bg-white rounded-sm" /> : <span>{team.tag?.charAt(0)}</span>}
                </div>
                <span className={`badge-neon ${regionColors[team.region] || 'badge-neon'}`}>
                    {team.region}
                </span>
            </div>

            <div className="pt-4 px-6 pb-6">
                <h3 className="text-[1.2rem] font-semibold text-text-primary mb-1 leading-[1.3]">{team.name}</h3>
                <span className="inline-block font-heading text-text-muted text-[0.85rem] mb-4">[{team.tag}]</span>
                <div className="flex flex-col gap-2 pt-4 border-t border-border-default">
                    <div className={metaItem}>
                        <i className={`bi bi-controller ${metaIcon}`}></i>
                        <span>{team.gameName}</span>
                    </div>
                    <div className={metaItem}>
                        <i className={`bi bi-calendar3 ${metaIcon}`}></i>
                        <span>Est. {team.foundedYear}</span>
                    </div>
                    <div className={metaItem}>
                        {team.countryFlag ? (
                            <img src={team.countryFlag} alt={team.countryName} width="24" height="18" loading="lazy" decoding="async" className={flagClass} />
                        ) : (
                            <i className={`bi bi-geo-alt-fill ${metaIcon}`}></i>
                        )}
                        <span>{team.countryName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TeamsList({ teams, loading, isAdmin, onEdit, onDelete }) {
    if (loading) {
        return <SkeletonGrid count={10} height={280} className={gridCls} />;
    }

    if (teams.length === 0) {
        return (
            <EmptyState icon="bi-search" title="No teams found" description="Try adjusting your filters or search query." />
        );
    }

    return (
        <div className={gridCls}>
            {teams.map(team => (
                <TeamCard
                    key={team.id}
                    team={team}
                    isAdmin={isAdmin}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default TeamsList;
