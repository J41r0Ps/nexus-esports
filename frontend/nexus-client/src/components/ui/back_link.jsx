import { Link } from 'react-router-dom';

/**
 * Uppercase "back to index" link used at the top of detail screens.
 */
function BackLink({ to, children }) {
    return (
        <Link
            to={to}
            viewTransition
            className="inline-flex items-center gap-2 text-text-secondary font-heading text-[0.85rem] uppercase tracking-[0.1em] no-underline mb-6 relative z-[1] transition-all duration-150 hover:text-neon-cyan hover:gap-3 hover:no-underline"
        >
            <i className="bi bi-arrow-left"></i> {children}
        </Link>
    );
}

export default BackLink;
