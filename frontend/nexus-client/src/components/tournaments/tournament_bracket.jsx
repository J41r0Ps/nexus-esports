import { useAuth0 } from "@auth0/auth0-react";
import { useIsAdmin } from '@/hooks/use_is_admin';
import TournamentsService from '@/api/tournaments_service';
import apiClient from '@/api/api_client';
import { EmptyState } from '@/components/ui/states';
import { humanize } from '@/lib/format';

/* Admin "set winner" controls — quiet ghost buttons that only turn green once
   a winner is recorded (green = result semantics, per the accent discipline). */
const matchBtn = "flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-sm border font-heading text-[0.68rem] font-medium uppercase tracking-[0.08em] cursor-pointer transition-all duration-150";
const matchBtnIdle = "border-border-default bg-transparent text-text-secondary hover:text-neon-cyan hover:border-border-glow";
const matchBtnActive = "border-neon-green/50 bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,148,0.25)]";

function TeamRow({ logo, name, state }) {
    const isWinner = state === 'winner';
    const isLoser = state === 'loser';
    const isTbd = !name;

    return (
        <div className={`relative flex items-center gap-3 px-4 py-2.5 ${isWinner ? 'animate-winner-reveal rounded-sm' : ''}`}>
            {/* Winner accent rail */}
            {isWinner && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-neon-green shadow-[0_0_8px_rgba(0,255,148,0.6)]"></span>
            )}

            {logo ? (
                <img
                    src={logo} alt="" width="28" height="28" loading="lazy" decoding="async"
                    className={`w-7 h-7 rounded-sm object-cover shrink-0 ${isLoser ? 'opacity-50 grayscale' : ''}`}
                />
            ) : (
                <span className="w-7 h-7 rounded-sm bg-bg-secondary border border-border-default grid place-items-center text-text-muted font-heading text-[0.7rem] shrink-0">
                    {isTbd ? '?' : name.charAt(0)}
                </span>
            )}

            <span className={`min-w-0 grow truncate text-[0.9rem] ${isWinner
                ? 'text-text-primary font-semibold'
                : isLoser
                    ? 'text-text-muted'
                    : isTbd ? 'text-text-muted italic' : 'text-text-primary font-medium'}`}>
                {name || 'TBD'}
            </span>

            {isWinner && (
                <span className="w-5 h-5 grid place-items-center rounded-[4px] bg-neon-green/15 border border-neon-green/40 text-neon-green font-heading text-[0.65rem] font-bold shrink-0">
                    W
                </span>
            )}
            {isLoser && (
                <span className="w-5 h-5 grid place-items-center rounded-[4px] border border-border-default text-text-muted font-heading text-[0.65rem] shrink-0">
                    L
                </span>
            )}
        </div>
    );
}

function MatchCard({ match, isAdmin, onWinnerSet, isFinalStage }) {
    const hasWinner = match.winnerId != null;

    const isTeam1Winner = hasWinner && match.team1Id === match.winnerId;
    const isTeam2Winner = hasWinner && match.team2Id === match.winnerId;

    const team1State = hasWinner ? (isTeam1Winner ? 'winner' : 'loser') : '';
    const team2State = hasWinner ? (isTeam2Winner ? 'winner' : 'loser') : '';

    /* "Advances →" connector stub bridging the gap to the next round;
       glows green once the match has produced a winner. */
    const stub = isFinalStage
        ? ''
        : `after:content-[''] after:absolute after:top-1/2 after:left-full after:w-6 sm:after:w-8 after:h-px after:bg-gradient-to-r after:to-transparent ${hasWinner ? 'after:from-neon-green/50' : 'after:from-border-glow'}`;

    return (
        <div className={`relative rounded-md border border-border-default bg-bg-tertiary/70 backdrop-blur-sm transition-colors duration-[250ms] hover:border-border-glow ${stub}`}>
            {/* Meta strip — date + result status */}
            <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 font-heading text-[0.65rem] tracking-[0.15em] uppercase">
                <span className="inline-flex items-center gap-1.5 text-text-muted truncate">
                    <i className="bi bi-calendar-event"></i> {match.matchDate}
                </span>
                <span className={`inline-flex items-center gap-1.5 shrink-0 ${hasWinner ? 'text-neon-green' : 'text-neon-yellow'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasWinner ? 'bg-neon-green' : 'bg-neon-yellow'}`}></span>
                    {hasWinner ? 'Final' : 'Scheduled'}
                </span>
            </div>

            <TeamRow logo={match.team1Logo} name={match.team1Name} state={team1State} />
            <div className="mx-4 h-px bg-border-default"></div>
            <TeamRow logo={match.team2Logo} name={match.team2Name} state={team2State} />

            {isAdmin && (
                <div className="px-4 pb-3 pt-2 mt-1 border-t border-dashed border-border-default">
                    <span className="block font-heading text-[0.6rem] tracking-[0.2em] uppercase text-text-muted mb-1.5">
                        Set winner
                    </span>
                    <div className="flex gap-2">
                        <button
                            className={`${matchBtn} ${isTeam1Winner ? matchBtnActive : matchBtnIdle}`}
                            onClick={() => onWinnerSet(match, 'team1')}
                        >
                            <i className="bi bi-trophy-fill"></i> <span className="truncate">{match.team1Name || 'TBD'}</span>
                        </button>
                        <button
                            className={`${matchBtn} ${isTeam2Winner ? matchBtnActive : matchBtnIdle}`}
                            onClick={() => onWinnerSet(match, 'team2')}
                        >
                            <i className="bi bi-trophy-fill"></i> <span className="truncate">{match.team2Name || 'TBD'}</span>
                        </button>
                    </div>
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

    const sortedStages = [...stages].sort((a, b) => a.order - b.order);

    return (
        <div className="mb-12 fade-in-up">
            {/* Columns stretch to equal height; justify-around funnels later rounds
                toward the vertical center, like a real elimination bracket. */}
            <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-4 snap-x">
                {sortedStages.map((stage, stageIdx) => {
                    const stageMatches = matchesByStage[stage.stageType] || [];
                    const played = stageMatches.filter(m => m.winnerId != null).length;
                    const isFinalStage = stageIdx === sortedStages.length - 1;

                    return (
                        <div key={stage.id} className="w-[min(85vw,320px)] sm:w-[300px] shrink-0 flex flex-col snap-start">
                            {/* Stage header */}
                            <div className="flex items-end justify-between gap-3 mb-5 pb-3 border-b border-border-default">
                                <div className="min-w-0">
                                    <span className="block font-heading text-[0.65rem] tracking-[0.25em] uppercase text-neon-cyan mb-1">
                                        Round {stage.order}
                                    </span>
                                    <h3 className="font-heading text-[1.05rem] font-semibold text-text-primary m-0 truncate">
                                        {humanize(stage.stageType)}
                                    </h3>
                                </div>
                                {stageMatches.length > 0 && (
                                    <span className="text-[0.72rem] text-text-muted tabular-nums shrink-0">
                                        {played}/{stageMatches.length} played
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col justify-around gap-4 grow">
                                {stageMatches.length > 0 ? (
                                    stageMatches.map(match => (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            isAdmin={isAdmin}
                                            onWinnerSet={handleWinnerSet}
                                            isFinalStage={isFinalStage}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-10 px-4 text-text-muted border border-dashed border-border-default rounded-md text-[0.85rem]">
                                        <i className="bi bi-hourglass text-[1.4rem]"></i>
                                        <span>Awaiting matchups</span>
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
