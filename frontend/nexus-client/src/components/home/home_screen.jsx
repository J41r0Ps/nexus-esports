import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Layout from '@/layout_template';

function HomeScreen() {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();

    return (
        <Layout>
            {/* ─────────────  HERO SECTION  ───────────── */}
            <section className="hero">
                <div className="hero-grid"></div>
                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>

                <div className="hero-content">
                    <span className="hero-badge fade-in-up">
                        <span className="hero-badge-dot pulse-glow"></span>
                        ESPORTS MANAGEMENT PLATFORM
                    </span>

                    <h1 className="hero-title fade-in-up">
                        Welcome to <span className="text-glow">NEXUS</span>
                    </h1>

                    <p className="hero-subtitle fade-in-up">
                        The all-in-one platform for managing competitive esports.<br />
                        Teams, players, tournaments — all in one place.
                    </p>

                    <div className="hero-actions fade-in-up">
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
                        <div className="hero-welcome fade-in-up">
                            <i className="bi bi-stars"></i>
                            Welcome back, <strong>{user.email}</strong>
                        </div>
                    )}
                </div>
            </section>

            {/* ─────────────  STATS BAR  ───────────── */}
            <section className="stats-section fade-in-up">
                <div className="stat-card glass-card">
                    <div className="stat-icon stat-icon-cyan">
                        <i className="bi bi-shield-fill"></i>
                    </div>
                    <div className="stat-value">20+</div>
                    <div className="stat-label">Teams</div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon stat-icon-violet">
                        <i className="bi bi-person-fill"></i>
                    </div>
                    <div className="stat-value">100+</div>
                    <div className="stat-label">Players</div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon stat-icon-pink">
                        <i className="bi bi-trophy-fill"></i>
                    </div>
                    <div className="stat-value">10+</div>
                    <div className="stat-label">Tournaments</div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon stat-icon-green">
                        <i className="bi bi-controller"></i>
                    </div>
                    <div className="stat-value">10</div>
                    <div className="stat-label">Games</div>
                </div>
            </section>

            {/* ─────────────  FEATURES  ───────────── */}
            <section className="features-section">
                <h2 className="features-title">
                    Everything you need to <span className="text-glow">dominate</span>
                </h2>
                <p className="features-subtitle">
                    Built for organizations, teams, and competitive players.
                </p>

                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-people-fill"></i>
                        </div>
                        <h3 className="feature-title">Team Management</h3>
                        <p className="feature-desc">
                            Manage rosters, sponsors and contracts. Track every player
                            and their performance.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-bar-chart-line-fill"></i>
                        </div>
                        <h3 className="feature-title">Player Statistics</h3>
                        <p className="feature-desc">
                            Real-time K/D/A tracking, performance charts and detailed
                            match-by-match analysis.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-diagram-3-fill"></i>
                        </div>
                        <h3 className="feature-title">Tournament Brackets</h3>
                        <p className="feature-desc">
                            Visualize tournament progression with interactive brackets
                            and live match updates.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-shield-lock-fill"></i>
                        </div>
                        <h3 className="feature-title">Secure Access</h3>
                        <p className="feature-desc">
                            Role-based authentication powered by Auth0. Public browsing,
                            admin control.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-broadcast"></i>
                        </div>
                        <h3 className="feature-title">Live Updates</h3>
                        <p className="feature-desc">
                            Real-time match scores and tournament progression powered
                            by SignalR.
                        </p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">
                            <i className="bi bi-envelope-paper-fill"></i>
                        </div>
                        <h3 className="feature-title">Email Notifications</h3>
                        <p className="feature-desc">
                            Automatic confirmations on tournament registration and
                            other important events.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─────────────  CTA  ───────────── */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="cta-card glass-card">
                        <h2 className="cta-title">
                            Ready to <span className="text-glow">compete?</span>
                        </h2>
                        <p className="cta-desc">
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