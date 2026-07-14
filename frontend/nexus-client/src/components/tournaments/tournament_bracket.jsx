import { useAuth0 } from "@auth0/auth0-react";
import { useIsAdmin } from '@/hooks/use_is_admin';
import TournamentsService from '@/api/tournaments_service';
import apiClient from '@/api/api_client';
import { EmptyState } from '@/components/ui/states';

const teamBase = "relative flex items-center justify-between px-3 py-2 rounded-sm mb-1 transition-all duration-150";
const matchBtn = "flex-1 py-[0.4rem] px-[0.6rem] rounded-sm font-heading text-[0.7rem] font-medium uppercase tracking-[0.05em] cursor-pointer transition-all duration-150 flex items-center justify-center gap-[0.3rem] border";
const matchBtnIdle = "bg-neon-violet/[0.08] border-neon-violet/30 text-neon-violet hover:bg-neon-violet/20 hover:shadow-[0_0_10px_rgba(176,38,255,0.4)]";
const matchBtnActive = "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_10px_rgba(0,255,148,0.4)]";

function TeamRow({ logo, name, state }) {
    const isWinner = state === 'winner';
    const isLoser = state === 'loser';
    const stateClass = isWinner
        ? "bg-gradient-to-br from-[rgba(0,255,148,0.15)] to-[rgba(0,240,255,0.08)] border border-[rgba(0,255,148,0.4)] shadow-[0_0_15px_rgba(0,255,148,0.2)] animate-winner-reveal"
        : isLoser
            ? "opacity-[0.55] [filter:grayscale(0.3)]"
            : "";

    return (
        <div className={`${teamBase} ${stateClass}`}>
            <div className="flex items-center gap-[0.6rem]">
                {logo && <img src={logo} alt={name} className="w-7 h-7 rounded-sm object-cover" />}
                <span className={`font-medium text-[0.9rem] ${isWinner ? 'text-neon-green !font-bold' : 'text-text-primary'} ${isLoser ? 'line-through decoration-[rgba(255,46,136,0.5)]' : ''}`}>
                    {name}
                </span>
            </div>
            {isWinner && (
                <i className="bi bi-trophy-fill absolute right-3 top-1/2 -translate-y-1/2 text-neon-yellow text-[1.2rem] [text-shadow:0_0_8px_rgba(255,215,0,0.6)] animate-trophy-pop"></i>
            )}
        </div>
    );
}

function MatchCard({ match, isAdmin, onWinnerSet }) {
    const hasWinner = match.winnerId != null;

    // Determine which team is the winner
    const isTeam1Winner = hasWinner && match.team1Id === match.winnerId;
    const isTeam2Winner = hasWinner && match.team2Id === match.winnerId;

    const team1State = hasWinner ? (isTeam1Winner ? 'winner' : 'loser') : '';
    const team2State = hasWinner ? (isTeam2Winner ? 'winner' : 'loser') : '';

    return (
        <div className={`relative rounded-sm p-4 bg-bg-tertiary border border-border-default transition-all duration-[250ms] hover:border-border-glow hover:shadow-glow-cyan hover:translate-x-1 border-l-[3px] ${hasWinner ? 'border-l-neon-green' : 'border-l-neon-yellow'}`}>
            <TeamRow logo={match.team1Logo} name={match.team1Name} state={team1State} />

            <div className="text-center font-heading text-[0.7rem] tracking-[0.2em] text-text-muted py-1">VS</div>

            <TeamRow logo={match.team2Logo} name={match.team2Name} state={team2State} />

            <div className="flex items-center justify-center gap-[0.4rem] mt-3 pt-3 border-t border-border-default text-text-muted text-[0.75rem]">
                <i className="bi bi-calendar-event"></i> {match.matchDate}
            </div>

            {isAdmin && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-dashed border-border-default">
                    <button
                        className={`${matchBtn} ${isTeam1Winner ? matchBtnActive : matchBtnIdle}`}
                        onClick={() => onWinnerSet(match, 'team1')}
                    >
                        <i className="bi bi-trophy-fill"></i> {match.team1Name}
                    </button>
                    <button
                        className={`${matchBtn} ${isTeam2Winner ? matchBtnActive : matchBtnIdle}`}
                        onClick={() => onWinnerSet(match, 'team2')}
                    >
                        <i className="bi bi-trophy-fill"></i> {match.team2Name}
                    </button>
                </div>
            )}
        </div>
    );
}

function TournamentBracket({ stages, matches, tournamentId }) {
    const { getAccessTokenSilently } = useAuth0();
    const isAdmin = useIsAdmin();

    if (!stages || stages.length === 0) {
        return (
            <EmptyState icon="bi-diagram-3" title="No bracket data yet" description="Stages will appear here once the tournament starts." />
        );
    }

    const handleWinnerSet = async (match, side) => {
        try {
            const token = await getAccessTokenSilently();

            // Fetch full match detail to get team IDs
            const detailRes = await apiClient.get(
                `/tournaments/${tournamentId}/matches/${match.id}`
            );
            const detail = detailRes.data;

            const winnerId = side === 'team1' ? detail.team1.id : detail.team2.id;

            await TournamentsService.updateMatchWinner(tournamentId, match.id, winnerId, token);
            // SignalR will broadcast the update automatically
        } catch (error) {
            console.log(error);
        }
    };

    const matchesByStage = {};
    matches.forEach(m => {
        if (!matchesByStage[m.stageName]) matchesByStage[m.stageName] = [];
        matchesByStage[m.stageName].push(m);
    });

    return (
        <div className="rounded-md py-8 px-4 bg-bg-secondary border border-border-default mb-12 fade-in-up">
            <div className="flex gap-8 overflow-x-auto pb-4">
                {stages.sort((a, b) => a.order - b.order).map(stage => {
                    const stageMatches = matchesByStage[stage.stageType] || [];
                    return (
                        <div key={stage.id} className="min-w-[320px] shrink-0">
                            <div className="mb-6 p-4 bg-bg-tertiary rounded-sm border border-border-default text-center">
                                <span className="block font-heading text-[0.7rem] tracking-[0.2em] uppercase text-neon-cyan mb-1">
                                    Round {stage.order}
                                </span>
                                <h3 className="text-[1.1rem] font-semibold text-text-primary mb-1">
                                    {stage.stageType?.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <span className="text-[0.8rem] text-text-muted">
                                    {stageMatches.length} {stageMatches.length === 1 ? 'match' : 'matches'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {stageMatches.length > 0 ? (
                                    stageMatches.map(match => (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            isAdmin={isAdmin}
                                            onWinnerSet={handleWinnerSet}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-8 px-4 text-text-muted bg-bg-tertiary rounded-sm text-[0.85rem]">
                                        <i className="bi bi-hourglass text-[1.5rem]"></i>
                                        <span>No matches yet</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TournamentBracket;
