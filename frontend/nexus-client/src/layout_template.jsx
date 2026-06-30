import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function Layout({ children, title, subtitle }) {
    const { loginWithRedirect, logout, isAuthenticated, user, error } = useAuth0();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Detect scroll for navbar background change
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

    return (
        <>
            {/* ─────────────  NAVBAR  ───────────── */}
            <nav className={`nexus-navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="nexus-navbar-inner">

                        {/* Logo */}
                        <Link className="nexus-logo" to="/">
                            <span className="logo-bracket">[</span>
                            <span className="logo-text">NEXUS</span>
                            <span className="logo-bracket">]</span>
                            <span className="logo-sub">ESPORTS</span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="nexus-nav-links d-none d-lg-flex">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`nexus-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                >
                                    <i className={`bi ${link.icon}`}></i>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Right side — User + Login/Logout */}
                        <div className="nexus-nav-right d-none d-lg-flex">
                            {error && <span className="nexus-error">{error.message}</span>}

                            {isAuthenticated && user && (
                                <div className="nexus-user">
                                    <div className="nexus-avatar">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="nexus-user-email">{user.email}</span>
                                </div>
                            )}

                            {isAuthenticated ? (
                                <button
                                    className="btn-neon btn-neon-violet"
                                    onClick={() => logout({ returnTo: window.location.origin })}
                                >
                                    <i className="bi bi-box-arrow-right me-1"></i>
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="btn-neon"
                                    onClick={() => loginWithRedirect()}
                                >
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Login
                                </button>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="nexus-burger d-lg-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className={menuOpen ? 'open' : ''}></span>
                            <span className={menuOpen ? 'open' : ''}></span>
                            <span className={menuOpen ? 'open' : ''}></span>
                        </button>
                    </div>

                    {/* Mobile menu drawer */}
                    <div className={`nexus-mobile-menu ${menuOpen ? 'open' : ''}`}>
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nexus-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                <i className={`bi ${link.icon}`}></i>
                                {link.label}
                            </Link>
                        ))}
                        <div className="nexus-mobile-divider"></div>
                        {isAuthenticated ? (
                            <button
                                className="btn-neon btn-neon-violet w-100"
                                onClick={() => logout({ returnTo: window.location.origin })}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                            </button>
                        ) : (
                            <button
                                className="btn-neon w-100"
                                onClick={() => loginWithRedirect()}
                            >
                                <i className="bi bi-box-arrow-in-right me-2"></i>Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ─────────────  PAGE HEADER  ───────────── */}
            {title && (
                <header className="nexus-page-header">
                    <div className="container">
                        <h1 className="nexus-page-title text-glow fade-in-up">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="nexus-page-subtitle fade-in-up">{subtitle}</p>
                        )}
                    </div>
                </header>
            )}

            {/* ─────────────  MAIN CONTENT  ───────────── */}
            <main className="nexus-main container">
                {children}
            </main>

            {/* ─────────────  FOOTER  ───────────── */}
            <footer className="nexus-footer">
                <div className="container">
                    <div className="nexus-footer-inner">
                        <span className="nexus-footer-brand">
                            <span className="text-glow">NEXUS</span> ESPORTS PLATFORM
                        </span>
                        <span className="nexus-footer-copy">
                            &copy; {new Date().getFullYear()} — Built for competitive gaming
                        </span>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Layout;