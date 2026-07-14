import { EmptyState } from '@/components/ui/states';

function TournamentTeams({ teams }) {
    if (!teams || teams.length === 0) {
        return (
            <EmptyState icon="bi-shield" title="No registered teams" description="Teams will appear here once they register." />
        );
    }

    const sorted = [...teams].sort((a, b) => a.seedNumber - b.seedNumber);

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-12 fade-in-up">
            {sorted.map(team => (
                <div key={team.teamId} className="glass-card flex items-center gap-4 p-5">
                    <div className="font-heading text-[1.75rem] font-bold text-neon-cyan min-w-[50px] text-center [text-shadow:0_0_15px_var(--neon-cyan-dim)]">#{team.seedNumber}</div>

                    {team.teamFlag && (
                        <img
                            src={team.teamFlag}
                            alt={team.teamName}
                            width="28"
                            height="20"
                            loading="lazy"
                            decoding="async"
                            className="w-7 h-5 object-cover rounded-[3px] border border-border-default shrink-0"
                        />
                    )}

                    <div className="grow">
                        <h4 className="mb-[0.15rem] text-text-primary text-base font-semibold">{team.teamName}</h4>
                        <span className="font-heading text-text-muted text-[0.8rem]">[{team.teamTag}]</span>
                    </div>
                    <div className="flex items-center gap-[0.4rem] text-text-secondary text-[0.8rem]">
                        <i className="bi bi-calendar3 text-neon-violet"></i>
                        {team.registeredAt}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TournamentTeams;
