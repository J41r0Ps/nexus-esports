import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function Layout({ children, title }) {
    const { loginWithRedirect, logout, isAuthenticated, user, error } = useAuth0();

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark border-bottom mb-4">
                    <div className="container">
                        <Link className="navbar-brand fw-bold" to="/">
                            <span className="text-primary">NEXUS</span>
                            <span className="text-white"> ESPORTS</span>
                        </Link>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/teams">Teams</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/players">Players</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/tournaments">Tournaments</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span style={{ color: "red" }}>
                                {error && `Error: ${error.message}`}
                            </span>
                            <span style={{ color: "lightgreen" }} className="small">
                                {user && user.email}
                            </span>
                            {isAuthenticated ? (
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={() => logout({ returnTo: window.location.origin })}
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => loginWithRedirect()}
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            <main role="main" className="container pb-3">
                <h1 className="mb-4">{title}</h1>
                {children}
            </main>

            <footer className="border-top footer text-muted mt-5">
                <div className="container py-2">
                    &copy; {new Date().getFullYear()} NEXUS Esports Platform
                </div>
            </footer>
        </>
    );
}

export default Layout;