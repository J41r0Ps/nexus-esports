import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/layout_template';
import TournamentBracket from './tournament_bracket';
import TournamentTeams from './tournament_teams';
import TournamentsService from '@/api/tournaments_service';
import { useMatchHub } from '@/hooks/use_match_hub';
import { LoadingState, EmptyState } from '@/components/ui/states';
import BackLink from '@/components/ui/back_link';
import { statusOf } from '@/lib/tournament_status';
import { formatMoney, humanize } from '@/lib/format';

const tabBase = "inline-flex items-center gap-2 py-[0.85rem] px-4 sm:px-6 bg-transparent border-none text-text-secondary font-heading font-medium text-[0.9rem] tracking-[0.05em] uppercase cursor-pointer border-b-2 border-b-transparent transition-all duration-150 whitespace-nowrap hover:text-neon-cyan";
const tabActive = "!text-neon-cyan !border-b-neon-cyan";

function TournamentDetailScreen() {
    const { id } = useParams();
    const [tournament, setTournament] = useState(null);
    const [matches, setMatches] = useState([]);
    const [activeTab, setActiveTab] = useState('bracket');
    const [loading, setLoading] = useState(true);

    const getTournament = async () => {
        try {
            setLoading(true);
            const result = await TournamentsService.getTournamentById(id);
            setTournament(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getMatches = async () => {
        try {
            const result = await TournamentsService.getMatches(id);
            setMatches(result.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTournament();
        getMatches();
    }, [id]);

    // SignalR — live match updates
    useMatchHub(id, (updatedMatch) => {
        // Just update the local match state — global toast handles the notification
        setMatches(prev => prev.map(m =>
            m.id === updatedMatch.id
                ? {
                    ...m,
                    winnerId: updatedMatch.winnerId,
                    team1Name: updatedMatch.team1?.name,
                    team2Name: updatedMatch.team2?.name
                }
                : m
        ));
    });

    if (loading) {
        return (
            <Layout>
                <LoadingState label="Loading tournament..." />
            </Layout>
        );
    }

    if (!tournament) {
        return (
            <Layout>
                <EmptyState icon="bi-trophy" title="Tournament not found">
                    <Link to="/tournaments" className="btn-neon mt-4 inline-block">Back to Tournaments</Link>
                </EmptyState>
            </Layout>
        );
    }

    const status = statusOf(tournament.status);

    return (
        <Layout>
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 py-[0.4rem] px-4 bg-neon-green/10 border border-neon-green/30 rounded-full font-heading text-[0.75rem] font-semibold tracking-[0.15em] text-neon-green mb-4">
                <span className="live-dot"></span>
                <span>LIVE UPDATES ENABLED</span>
            </div>

            <section className="relative py-8 px-5 sm:py-12 sm:px-8 rounded-lg border border-border-glow mb-8 overflow-hidden bg-[linear-gradient(135deg,rgba(0,240,255,0.08),rgba(176,38,255,0.08)),var(--bg-secondary)] fade-in-up before:content-[''] before:absolute before:-top-1/2 before:-right-[10%] before:w-[400px] before:h-[400px] before:bg-[radial-gradient(circle,var(--neon-violet)_0%,transparent_70%)] before:opacity-20 before:pointer-events-none after:content-[''] after:absolute after:-bottom-1/2 after:-left-[10%] after:w-[400px] after:h-[400px] after:bg-[radial-gradient(circle,var(--neon-cyan)_0%,transparent_70%)] after:opacity-15 after:pointer-events-none">
                <BackLink to="/tournaments">All Tournaments</BackLink>

                <div className="relative z-[1]">
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <span className={`badge-neon ${status.badge}`}>
                            <i className={`bi ${status.icon} me-1`}></i>
                            {status.label}
                        </span>
                        <span className="inline-flex items-center gap-[0.4rem] text-text-secondary font-heading text-[0.85rem] tracking-[0.05em] uppercase">
                            <i className="bi bi-controller text-neon-cyan"></i> {tournament.gameName}
                        </span>
                    </div>

                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-8 tracking-[-0.03em] leading-[1.1] text-glow">
                        {tournament.name}
                    </h1>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 sm:gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted">Prize Pool</span>
                            <span className="font-heading font-semibold bg-gradient-to-br from-neon-green to-neon-cyan bg-clip-text text-transparent text-[1.6rem] tabular-nums">
                                {formatMoney(tournament.prizePool)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted">Format</span>
                            <span className="font-heading text-xl font-semibold text-text-primary">
                                {humanize(tournament.format)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted">Start Date</span>
                            <span className="font-heading text-xl font-semibold text-text-primary">{tournament.startDate}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted">End Date</span>
                            <span className="font-heading text-xl font-semibold text-text-primary">{tournament.endDate}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-heading text-[0.7rem] tracking-[0.15em] uppercase text-text-muted">Teams</span>
                            <span className="font-heading text-xl font-semibold text-text-primary">
                                {tournament.registeredTeams?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <div role="tablist" aria-label="Tournament sections" className="flex gap-2 border-b border-border-default mb-8 overflow-x-auto">
                <button
                    role="tab"
                    aria-selected={activeTab === 'bracket'}
                    className={`${tabBase} ${activeTab === 'bracket' ? tabActive : ''}`}
                    onClick={() => setActiveTab('bracket')}
                >
                    <i className="bi bi-diagram-3-fill"></i> Bracket
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'teams'}
                    className={`${tabBase} ${activeTab === 'teams' ? tabActive : ''}`}
                    onClick={() => setActiveTab('teams')}
                >
                    <i className="bi bi-shield-fill"></i> Teams
                    <span className={`py-[0.15rem] px-2 rounded-full text-[0.7rem] font-semibold ${activeTab === 'teams' ? 'bg-neon-cyan text-bg-primary' : 'bg-bg-tertiary'}`}>{tournament.registeredTeams?.length || 0}</span>
                </button>
            </div>

            {activeTab === 'bracket' && (
                <TournamentBracket
                    stages={tournament.stages}
                    matches={matches}
                    tournamentId={id}
                />
            )}

            {activeTab === 'teams' && (
                <TournamentTeams teams={tournament.registeredTeams} />
            )}

        </Layout>
    );
}

export default TournamentDetailScreen;
