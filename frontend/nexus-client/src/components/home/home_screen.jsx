import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';

const statCard = "glass-card py-8 px-6 text-center";
const statIcon = "inline-flex items-center justify-center w-[60px] h-[60px] rounded-full text-[1.8rem] mb-4";
const statValue = "font-heading text-[2.5rem] font-bold text-text-primary leading-none mb-2";
const statLabel = "font-heading text-[0.85rem] tracking-[0.15em] uppercase text-text-secondary";
const featureCard = "glass-card p-8";
const featureIcon = "inline-flex items-center justify-center w-[50px] h-[50px] rounded-sm bg-gradient-to-br from-neon-cyan to-neon-violet text-bg-primary text-[1.4rem] mb-5";
const featureTitle = "text-[1.25rem] font-semibold mb-3 text-text-primary";
const featureDesc = "text-text-secondary text-[0.95rem] leading-relaxed m-0";

function HomeScreen() {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();

    return (
        <Layout>
            {/* ─────────────  HERO SECTION  ───────────── */}
            <section className="relative min-h-[80vh] flex items-center justify-center text-center py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 animate-grid [background-image:linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] [background-size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
                <div className="absolute rounded-full blur-[80px] opacity-40 pointer-events-none animate-float w-[400px] h-[400px] bg-neon-cyan -top-[100px] -left-[100px]"></div>
                <div className="absolute rounded-full blur-[80px] opacity-40 pointer-events-none animate-float w-[500px] h-[500px] bg-neon-violet -bottom-[150px] -right-[100px] [animation-delay:-4s]"></div>

                <div className="relative z-[1] max-w-[800px]">
                    <span className="fade-in-up inline-flex items-center gap-2 py-[0.4rem] px-4 bg-neon-cyan/[0.08] border border-border-glow rounded-full font-heading text-[0.75rem] font-semibold tracking-[0.2em] text-neon-cyan mb-8" style={{ animationDelay: '0.1s' }}>
                        <span className="pulse-glow w-2 h-2 rounded-full bg-neon-cyan"></span>
                        ESPORTS MANAGEMENT PLATFORM
                    </span>

                    <h1 className="fade-in-up text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.1] mb-6 tracking-[-0.04em]" style={{ animationDelay: '0.2s' }}>
                        Welcome to <span className="text-glow">NEXUS</span>
                    </h1>

                    <p className="fade-in-up text-[1.2rem] text-text-secondary leading-relaxed mb-10 max-w-[600px] mx-auto" style={{ animationDelay: '0.3s' }}>
                        The all-in-one platform for managing competitive esports.<br />
                        Teams, players, tournaments — all in one place.
                    </p>

                    <div className="fade-in-up flex justify-center gap-4 flex-wrap mb-8" style={{ animationDelay: '0.4s' }}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/tournaments" className="btn-neon">
                                    <i className="bi bi-trophy-fill me-2"></i>
                                    View Tournaments
                                </Link>
                                <Link to="/teams" className="btn-neon btn-neon-violet">
                                    <i className="bi bi-shield-fill me-2"></i>
                                    Browse Teams
                                </Link>
                            </>
                        ) : (
                            <>
                                <button className="btn-neon" onClick={() => loginWithRedirect()}>
                                    <i className="bi bi-rocket-takeoff-fill me-2"></i>
                                    Get Started
                                </button>
                                <Link to="/teams" className="btn-neon btn-neon-violet">
                                    <i className="bi bi-eye-fill me-2"></i>
                                    Explore Platform
                                </Link>
                            </>
                        )}
                    </div>

                    {isAuthenticated && user && (
                        <div className="fade-in-up text-text-secondary text-[0.95rem] mt-6" style={{ animationDelay: '0.5s' }}>
                            <i className="bi bi-stars text-neon-yellow mr-2"></i>
                            Welcome back, <strong className="text-neon-cyan font-semibold">{user.email}</strong>
                        </div>
                    )}
                </div>
            </section>

            {/* ─────────────  STATS BAR  ───────────── */}
            <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 my-16 fade-in-up">
                <div className={statCard}>
                    <div className={`${statIcon} bg-neon-cyan/10 text-neon-cyan`}>
                        <i className="bi bi-shield-fill"></i>
                    </div>
                    <div className={statValue}>20+</div>
                    <div className={statLabel}>Teams</div>
                </div>

                <div className={statCard}>
                    <div className={`${statIcon} bg-neon-violet/10 text-neon-violet`}>
                        <i className="bi bi-person-fill"></i>
                    </div>
                    <div className={statValue}>100+</div>
                    <div className={statLabel}>Players</div>
                </div>

                <div className={statCard}>
                    <div className={`${statIcon} bg-neon-pink/10 text-neon-pink`}>
                        <i className="bi bi-trophy-fill"></i>
                    </div>
                    <div className={statValue}>10+</div>
                    <div className={statLabel}>Tournaments</div>
                </div>

                <div className={statCard}>
                    <div className={`${statIcon} bg-neon-green/10 text-neon-green`}>
                        <i className="bi bi-controller"></i>
                    </div>
                    <div className={statValue}>10</div>
                    <div className={statLabel}>Games</div>
                </div>
            </section>

            {/* ─────────────  FEATURES  ───────────── */}
            <section className="text-center my-24">
                <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-3 tracking-[-0.03em]">
                    Everything you need to <span className="text-glow">dominate</span>
                </h2>
                <p className="text-text-secondary text-[1.1rem] mb-12">
                    Built for organizations, teams, and competitive players.
                </p>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 text-left">
                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <h3 className={featureTitle}>Team Management</h3>
                        <p className={featureDesc}>
                            Manage rosters, sponsors and contracts. Track every player
                            and their performance.
                        </p>
                    </div>

                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-bar-chart-line-fill"></i>
                        </div>
                        <h3 className={featureTitle}>Player Statistics</h3>
                        <p className={featureDesc}>
                            Real-time K/D/A tracking, performance charts and detailed
                            match-by-match analysis.
                        </p>
                    </div>

                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-diagram-3-fill"></i>
                        </div>
                        <h3 className={featureTitle}>Tournament Brackets</h3>
                        <p className={featureDesc}>
                            Visualize tournament progression with interactive brackets
                            and live match updates.
                        </p>
                    </div>

                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-shield-lock-fill"></i>
                        </div>
                        <h3 className={featureTitle}>Secure Access</h3>
                        <p className={featureDesc}>
                            Role-based authentication powered by Auth0. Public browsing,
                            admin control.
                        </p>
                    </div>

                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-broadcast"></i>
                        </div>
                        <h3 className={featureTitle}>Live Updates</h3>
                        <p className={featureDesc}>
                            Real-time match scores and tournament progression powered
                            by SignalR.
                        </p>
                    </div>

                    <div className={featureCard}>
                        <div className={featureIcon}>
                            <i className="bi bi-envelope-paper-fill"></i>
                        </div>
                        <h3 className={featureTitle}>Email Notifications</h3>
                        <p className={featureDesc}>
                            Automatic confirmations on tournament registration and
                            other important events.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─────────────  CTA  ───────────── */}
            {!isAuthenticated && (
                <section className="mt-24 mb-8">
                    <div className="glass-card py-16 px-8 text-center !border-border-glow bg-[linear-gradient(135deg,rgba(0,240,255,0.05)_0%,rgba(176,38,255,0.05)_100%)]">
                        <h2 className="text-[clamp(2rem,5vw,2.8rem)] font-bold mb-4 tracking-[-0.03em]">
                            Ready to <span className="text-glow">compete?</span>
                        </h2>
                        <p className="text-text-secondary text-[1.1rem] mb-8 max-w-[500px] mx-auto">
                            Sign in to register your team for upcoming tournaments
                            and access admin features.
                        </p>
                        <button className="btn-neon pulse-glow" onClick={() => loginWithRedirect()}>
                            <i className="bi bi-rocket-takeoff-fill me-2"></i>
                            Join NEXUS Now
                        </button>
                    </div>
                </section>
            )}
        </Layout>
    );
}

export default HomeScreen;
