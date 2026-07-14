import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from '@/context/theme_context';
import ScrollToTop from '@/components/ui/scroll_to_top';
import LiveToast from '@/components/ui/live_toast';

// Shared page width used by the navbar, header, main and footer.
const container = "w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10";

/**
 * App chrome wrapped around every route: the scroll-reactive navbar (auth
 * controls, theme toggle, responsive menu), an optional page header, the main
 * content area, the footer, and the global live-match toast + scroll-to-top.
 *
 * @param {{ children: React.ReactNode, title?: string, subtitle?: string }} props
 */
function Layout({ children, title, subtitle }) {
    const { loginWithRedirect, logout, isAuthenticated, user, error, getAccessTokenSilently } = useAuth0();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    // Detect scroll for the navbar background/padding animation
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const navLinks = [
        { path: '/teams', label: 'Teams', icon: 'bi-shield-fill' },
        { path: '/players', label: 'Players', icon: 'bi-person-fill' },
        { path: '/tournaments', label: 'Tournaments', icon: 'bi-trophy-fill' },
    ];

    const isActive = (path) => location.pathname === path;

    const themeToggleBtn = (
        <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            className="w-10 h-10 rounded-full grid place-items-center bg-bg-secondary border border-border-default text-neon-cyan cursor-pointer text-[1.1rem] transition-all duration-300 hover:border-border-glow hover:shadow-glow-cyan hover:rotate-[18deg] shrink-0"
        >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
        </button>
    );

    return (
        <>
            {/* ─────────────  NAVBAR (full-width, scroll-reactive)  ───────────── */}
            <nav className={`sticky top-0 z-[1000] transition-all duration-300 ${scrolled
                ? 'py-2 bg-bg-overlay backdrop-blur-xl border-b border-border-default shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]'
                : 'py-4 bg-transparent border-b border-transparent'}`}>
                <div className={container}>
                    <div className="flex items-center gap-6">

                        {/* Logo */}
                        <Link to="/" className="flex items-baseline gap-[0.15rem] font-heading font-bold text-[1.4rem] tracking-[0.05em] no-underline shrink-0">
                            <span className="text-neon-cyan font-light [text-shadow:0_0_10px_var(--neon-cyan-dim)]">[</span>
                            <span className="bg-gradient-to-br from-neon-cyan to-neon-violet bg-clip-text text-transparent">NEXUS</span>
                            <span className="text-neon-cyan font-light [text-shadow:0_0_10px_var(--neon-cyan-dim)]">]</span>
                            <span className="hidden sm:inline text-text-muted text-[0.7rem] font-medium tracking-[0.3em] ml-2 self-center">ESPORTS</span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex items-center gap-1 grow ml-6">
                            {navLinks.map(link => {
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative flex items-center gap-2 px-4 py-2 font-heading font-medium text-[0.9rem] tracking-[0.05em] uppercase no-underline transition-colors duration-200 ${active ? 'text-neon-cyan' : 'text-text-secondary hover:text-neon-cyan'}`}
                                    >
                                        <i className={`bi ${link.icon}`}></i>
                                        <span>{link.label}</span>
                                        <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet shadow-[0_0_10px_var(--neon-cyan)] transition-all duration-300 ${active ? 'w-7 opacity-100' : 'w-0 opacity-0'}`}></span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side — desktop */}
                        <div className="hidden lg:flex items-center gap-3 ml-auto">
                            {error && <span className="text-[#ff4d6d] text-[0.8rem]">{error.message}</span>}

                            {themeToggleBtn}

                            {isAuthenticated && user && (
                                <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-bg-secondary border border-border-default rounded-full">
                                    <div className="w-8 h-8 rounded-full grid place-items-center bg-gradient-to-br from-neon-cyan to-neon-violet text-bg-primary font-heading font-bold text-[0.85rem]">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-text-secondary text-[0.85rem] max-w-[150px] truncate">{user.email}</span>
                                </div>
                            )}

                            {isAuthenticated && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = await getAccessTokenSilently();
                                            await navigator.clipboard.writeText(token);
                                            alert('✅ Token copied! Paste in Swagger.');
                                        } catch (err) {
                                            alert('❌ ' + err.message);
                                        }
                                    }}
                                    title="Copy JWT token for API testing"
                                    className="px-3 py-2 rounded-sm bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/40 font-heading text-[0.75rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-neon-yellow/20"
                                >
                                    <i className="bi bi-key-fill mr-1"></i> Token
                                </button>
                            )}

                            {isAuthenticated ? (
                                <button className="btn-neon btn-neon-violet" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                                    <i className="bi bi-box-arrow-right mr-1"></i> Logout
                                </button>
                            ) : (
                                <button className="btn-neon" onClick={() => loginWithRedirect()}>
                                    <i className="bi bi-box-arrow-in-right mr-1"></i> Login
                                </button>
                            )}
                        </div>

                        {/* Right side — mobile (theme + animated hamburger) */}
                        <div className="flex lg:hidden items-center gap-3 ml-auto">
                            {themeToggleBtn}
                            <button
                                className="relative w-7 h-[22px] shrink-0 bg-transparent border-0 cursor-pointer"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`absolute left-0 h-[2px] w-full bg-neon-cyan rounded-full transition-all duration-300 [box-shadow:0_0_6px_var(--neon-cyan-dim)] ${menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`}></span>
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-neon-cyan rounded-full transition-all duration-300 [box-shadow:0_0_6px_var(--neon-cyan-dim)] ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`absolute left-0 h-[2px] w-full bg-neon-cyan rounded-full transition-all duration-300 [box-shadow:0_0_6px_var(--neon-cyan-dim)] ${menuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'}`}></span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile drawer */}
                    <div className={`lg:hidden flex flex-col gap-2 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[520px] mt-4 pb-2 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-heading font-medium text-[0.9rem] uppercase no-underline border transition-all duration-200 ${isActive(link.path)
                                    ? 'text-neon-cyan border-border-glow bg-neon-cyan/[0.06]'
                                    : 'text-text-secondary border-border-default bg-bg-secondary hover:text-neon-cyan hover:border-border-glow'}`}
                            >
                                <i className={`bi ${link.icon}`}></i>
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-border-default my-1"></div>
                        {isAuthenticated ? (
                            <button className="btn-neon btn-neon-violet w-full" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                                <i className="bi bi-box-arrow-right mr-2"></i>Logout
                            </button>
                        ) : (
                            <button className="btn-neon w-full" onClick={() => loginWithRedirect()}>
                                <i className="bi bi-box-arrow-in-right mr-2"></i>Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─────────────  PAGE HEADER  ───────────── */}
            {title && (
                <header className="relative pt-12 pb-6">
                    <div className={container}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-[2px] w-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet shadow-[0_0_10px_var(--neon-cyan)]"></span>
                            <span className="font-heading text-[0.7rem] tracking-[0.35em] uppercase text-text-muted">NEXUS · Platform</span>
                        </div>
                        <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold mb-2 tracking-[-0.03em] text-glow fade-in-up">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-text-secondary text-[1.1rem] m-0 fade-in-up">{subtitle}</p>
                        )}
                    </div>
                </header>
            )}

            {/* ─────────────  MAIN CONTENT  ───────────── */}
            <main className={`${container} min-h-[calc(100vh-360px)] pt-2 pb-20 animate-[pageFadeIn_0.4s_cubic-bezier(0.4,0,0.2,1)]`}>
                {children}
            </main>

            {/* ─────────────  FOOTER  ───────────── */}
            <footer className="border-t border-border-default mt-20 py-10 bg-bg-overlay backdrop-blur-md">
                <div className={`${container} flex flex-col sm:flex-row justify-between items-center gap-4 text-center`}>
                    <span className="font-heading font-semibold tracking-[0.1em] text-[0.95rem]">
                        <span className="text-glow">NEXUS</span> ESPORTS PLATFORM
                    </span>
                    <span className="text-text-muted text-[0.85rem]">
                        &copy; {new Date().getFullYear()} — Built for competitive gaming
                    </span>
                </div>
            </footer>
            <LiveToast />
            <ScrollToTop />
        </>
    );
}

export default Layout;
