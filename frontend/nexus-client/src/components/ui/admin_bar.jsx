/**
 * Admin-only banner shown above list screens: "Admin Panel" label plus the
 * primary create action. Render only when `useIsAdmin()` is true.
 */
function AdminBar({ addLabel, onAdd }) {
    return (
        <div className="fade-in-up flex items-center justify-between gap-4 flex-wrap py-4 px-6 rounded-md mb-6 bg-[linear-gradient(135deg,rgba(176,38,255,0.08),rgba(255,46,136,0.05))] border border-neon-violet/30">
            <span className="inline-flex items-center gap-2 text-neon-violet font-heading text-[0.85rem] font-semibold tracking-[0.1em] uppercase">
                <i className="bi bi-shield-lock-fill"></i> Admin Panel
            </span>
            <button className="btn-neon-primary" onClick={onAdd}>
                <i className="bi bi-plus-lg me-2"></i> {addLabel}
            </button>
        </div>
    );
}

export default AdminBar;
