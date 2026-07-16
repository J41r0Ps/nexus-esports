import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';
import HeroLivePanel from './hero_live_panel';
import StatCard from './stat_card';
import FeatureCard from './feature_card';
import TechBadge from './tech_badge';
import TournamentMiniCard from './tournament_mini_card';
import Reveal from '@/components/ui/reveal';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { useLiveUpdates } from '@/context/live_updates_context';
import TeamsService from '@/api/teams_service';
import PlayersService from '@/api/players_service';
import TournamentsService from '@/api/tournaments_service';
import GamesService from '@/api/games_service';

const TECH_STACK = ['React 19', 'Vite', 'Tailwind CSS v4', '.NET Web API', 'SignalR', 'Auth0', 'Azure'];

/* Decorative accents stay on the cyan/violet brand pair; green is reserved for
   "live" semantics (SignalR card, live-dot, Ongoing badge). Asymmetric spans
   (7/5 → 5/7) break the equal-card-grid monotony on xl. */
const FEATURES = [
    {
        icon: 'bi-diagram-3-fill', accent: 'cyan', span: 'xl:col-span-7', title: 'Live tournament brackets',
        description: 'Interactive elimination brackets for every stage. When an admin records a winner, the bracket advances instantly for everyone watching.',
    },
    {
        icon: 'bi-people-fill', accent: 'violet', span: 'xl:col-span-5', title: 'Real teams & players',
        description: 'Full rosters with player profiles and performance charts, backed by server-side search, filtering and pagination.',
    },
    {
        icon: 'bi-shield-lock-fill', accent: 'cyan', span: 'xl:col-span-5', title: 'Role-based admin',
        description: 'Auth0 secures the API with JWTs. Browsing is public; creating, editing and deleting teams, players and tournaments is admin-only.',
    },
    {
        icon: 'bi-broadcast', accent: 'green', span: 'xl:col-span-7', title: 'Real-time updates',
        description: 'A SignalR feed pushes every match result site-wide, and tournament pages patch scores in place without refetching.',
    },
];

const sectionEyebrow = "flex items-center gap-3 mb-4";
const eyebrowDash = "h-[2px] w-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet shadow-[0_0_10px_var(--neon-cyan)]";
const eyebrowLabel = "font-heading text-[0.7rem] tracking-[0.35em] uppercase text-text-muted";

function HomeScreen() {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const { latestUpdate } = useLiveUpdates();

    const [stats, setStats] = useState({ teams: null, players: null, tournaments: null, games: null });
    const [featured, setFeatured] = useState(null);
    const [featuredTeams, setFeaturedTeams] = useState([]);
    const [nextUp, setNextUp] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const countOf = (result) => JSON.parse(result.headers['x-pagination']).TotalItemCount;
        const one = { pageNumber: 1, pageSize: 1 };

        const load = async () => {
            try {
                const [teamsRes, playersRes, tournamentsRes, gamesRes, ongoingRes, upcomingRes, recentRes] = await Promise.all([
                    TeamsService.getAllTeams(one),
                    PlayersService.getAllPlayers(one),
                    TournamentsService.getAllTournaments(one),
                    GamesService.getAllGames(),
                    TournamentsService.getAllTournaments({ ...one, status: 'Ongoing' }),
                    TournamentsService.getAllTournaments({ ...one, status: 'Upcoming' }),
                    TournamentsService.getAllTournaments({ pageNumber: 1, pageSize: 3 }),
                ]);

                setStats({
                    teams: countOf(teamsRes),
                    players: countOf(playersRes),
                    tournaments: countOf(tournamentsRes),
                    games: gamesRes.data.length,
                });
                setRecent(recentRes.data);

                const feat = ongoingRes.data[0] ?? upcomingRes.data[0] ?? recentRes.data[0] ?? null;
                setFeatured(feat);
                const upcoming = upcomingRes.data[0];
                setNextUp(upcoming && feat && upcoming.id !== feat.id ? upcoming : null);

                if (feat) {
                    const regs = await TournamentsService.getRegistrations(feat.id);
                    setFeaturedTeams(regs.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <Layout>
            {/* ─────────────  HERO  ───────────── */}
            <section className="relative pt-10 pb-14 lg:pt-16">
                <div className="absolute inset-0 animate-grid motion-reduce:animate-none [background-image:linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] [background-size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
                <div className="absolute -right-20 top-10 w-[420px] h-[420px] rounded-full bg-neon-violet blur-[110px] opacity-25 pointer-events-none animate-float motion-reduce:animate-none"></div>

                <div className="relative z-[1] grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
                    {/* Left — value proposition */}
                    <div>
                        <span className="fade-in-up inline-flex items-center gap-2 py-[0.4rem] px-4 bg-neon-cyan/[0.08] border border-border-glow rounded-full font-heading text-[0.72rem] font-semibold tracking-[0.2em] text-neon-cyan mb-7" style={{ animationDelay: '0.05s' }}>
                            <span className="pulse-glow w-2 h-2 rounded-full bg-neon-cyan"></span>
                            ESPORTS MANAGEMENT PLATFORM
                        </span>

                        <h1 className="fade-in-up text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[1.08] tracking-[-0.04em] mb-6" style={{ animationDelay: '0.15s' }}>
                            Run tournaments.<br />
                            Track everything.<br />
                            <span className="text-glow">In real time.</span>
                        </h1>

                        <p className="fade-in-up text-[1.1rem] text-text-secondary leading-relaxed mb-8 max-w-[520px]" style={{ animationDelay: '0.25s' }}>
                            NEXUS manages the full competitive stack — team rosters, player
                            stats, and tournament brackets that update the moment a match ends.
                        </p>

                        <div className="fade-in-up flex flex-wrap items-center gap-x-7 gap-y-4" style={{ animationDelay: '0.35s' }}>
                            <Link to="/tournaments" viewTransition className="btn-neon-primary no-underline">
                                <i className="bi bi-trophy-fill me-2"></i>
                                Explore tournaments
                            </Link>
                            <Link to="/teams" viewTransition className="inline-flex items-center gap-2 text-neon-cyan font-heading text-[0.85rem] font-semibold uppercase tracking-[0.1em] no-underline hover:gap-3 transition-all duration-200">
                                Browse teams <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>

                        {isAuthenticated && user && (
                            <div className="fade-in-up text-text-secondary text-[0.9rem] mt-6" style={{ animationDelay: '0.45s' }}>
                                <i className="bi bi-stars text-neon-yellow mr-2"></i>
                                Welcome back, <strong className="text-neon-cyan font-semibold">{user.email}</strong>
                            </div>
                        )}
                    </div>

                    {/* Right — featured tournament, real data */}
                    <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <HeroLivePanel
                            tournament={featured}
                            teams={featuredTeams}
                            nextUp={nextUp}
                            latestUpdate={latestUpdate}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Stats strip — live counts from the API */}
                <div className="relative z-[1] glass-card fade-in-up mt-14 px-6 py-6 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7" style={{ animationDelay: '0.45s' }}>
                    <StatCard icon="bi-person-fill" value={stats.players} label="Players" tone="cyan" />
                    <StatCard icon="bi-shield-fill" value={stats.teams} label="Teams" tone="violet" />
                    <StatCard icon="bi-trophy-fill" value={stats.tournaments} label="Tournaments" tone="cyan" />
                    <StatCard icon="bi-controller" value={stats.games} label="Games" tone="violet" />
                </div>

                {/* Tech stack */}
                <div className="relative z-[1] fade-in-up flex flex-wrap items-center gap-2.5 mt-8" style={{ animationDelay: '0.55s' }}>
                    <span className={`${eyebrowLabel} mr-2`}>Built with</span>
                    {TECH_STACK.map(tech => <TechBadge key={tech} label={tech} />)}
                </div>
            </section>

            {/* ─────────────  FEATURES  ───────────── */}
            <section className="mt-20">
                <Reveal>
                    <div className={sectionEyebrow}>
                        <span className={eyebrowDash}></span>
                        <span className={eyebrowLabel}>Platform</span>
                    </div>
                    <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.03em] mb-3">
                        Built <span className="text-glow">end to end</span>
                    </h2>
                    <p className="text-text-secondary text-[1.05rem] mb-10 max-w-[560px]">
                        A React SPA on a .NET REST API — everything below runs against live data.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
                    {FEATURES.map(({ span, ...feature }, i) => (
                        <Reveal key={feature.title} delay={i * 0.08} className={`h-full ${span}`}>
                            <FeatureCard {...feature} />
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ─────────────  FEATURED TOURNAMENTS  ───────────── */}
            {(loading || recent.length > 0) && (
                <section className="mt-20">
                    <Reveal>
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                            <div>
                                <div className={sectionEyebrow}>
                                    <span className={eyebrowDash}></span>
                                    <span className={eyebrowLabel}>Compete</span>
                                </div>
                                <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.03em] m-0">
                                    Featured <span className="text-glow">tournaments</span>
                                </h2>
                            </div>
                            <Link to="/tournaments" viewTransition className="inline-flex items-center gap-2 text-neon-cyan font-heading text-[0.85rem] font-medium uppercase tracking-[0.1em] no-underline hover:gap-3 transition-all duration-200">
                                View all <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </Reveal>

                    {loading ? (
                        <SkeletonGrid count={3} height={260} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {recent.map((tournament, i) => (
                                <Reveal key={tournament.id} delay={i * 0.08} className="h-full">
                                    <TournamentMiniCard tournament={tournament} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ─────────────  EXPLORE  ─────────────
                Index-style list instead of a third card grid: cards are reserved
                for content that needs elevation; navigation rows group with
                borders and typography. */}
            <section className="mt-20">
                <div className="border-t border-border-default">
                    {[
                        { to: '/tournaments', label: 'Tournaments', count: stats.tournaments },
                        { to: '/teams', label: 'Teams', count: stats.teams },
                        { to: '/players', label: 'Players', count: stats.players },
                    ].map((row, i) => (
                        <Reveal key={row.to} delay={i * 0.08}>
                            <Link
                                to={row.to}
                                viewTransition
                                className="group flex items-baseline gap-5 sm:gap-8 py-6 sm:py-7 px-1 border-b border-border-default no-underline text-inherit hover:no-underline transition-colors duration-200"
                            >
                                <span className="font-heading text-[0.8rem] text-text-muted tabular-nums shrink-0">
                                    0{i + 1}
                                </span>
                                <span className="font-heading text-[clamp(1.5rem,3.5vw,2.2rem)] font-bold tracking-[-0.02em] leading-none text-text-primary transition-colors duration-200 group-hover:text-neon-cyan">
                                    {row.label}
                                </span>
                                <span className="text-text-secondary text-[0.85rem] tabular-nums hidden sm:inline">
                                    {row.count == null ? 'Browse all' : `${row.count} on the platform`}
                                </span>
                                <i className="bi bi-arrow-right ml-auto self-center text-[1.25rem] text-text-muted transition-all duration-[250ms] group-hover:text-neon-cyan group-hover:translate-x-2"></i>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ─────────────  CTA  ───────────── */}
            {!isAuthenticated && (
                <Reveal className="mt-20 mb-4">
                    <section>
                    <div className="glass-card !border-border-glow bg-[linear-gradient(135deg,rgba(0,240,255,0.05)_0%,rgba(176,38,255,0.05)_100%)] py-8 px-6 sm:py-10 sm:px-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-[560px]">
                            <h2 className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold mb-3 tracking-[-0.03em]">
                                Ready to <span className="text-glow">compete?</span>
                            </h2>
                            <p className="text-text-secondary text-[1.05rem] m-0">
                                Sign in to register your team for upcoming tournaments and access
                                admin features.
                            </p>
                        </div>
                        <button className="btn-neon-primary shrink-0 self-start md:self-center" onClick={() => loginWithRedirect()}>
                            <i className="bi bi-lightning-charge-fill me-2"></i>
                            Join NEXUS
                        </button>
                    </div>
                    </section>
                </Reveal>
            )}
        </Layout>
    );
}

export default HomeScreen;
