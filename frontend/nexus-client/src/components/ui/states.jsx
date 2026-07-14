// Shared loading / empty states used across list and detail screens.

export function LoadingState({ label = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-text-secondary">
            <div className="w-[50px] h-[50px] rounded-full border-[3px] border-bg-tertiary border-t-neon-cyan animate-spin mb-4 shadow-[0_0_20px_var(--neon-cyan-dim)]"></div>
            <p>{label}</p>
        </div>
    );
}

export function EmptyState({ icon, title, description, children }) {
    return (
        <div className="glass-card text-center py-16 px-6 sm:px-8">
            <i className={`bi ${icon} text-5xl text-text-muted mb-4 block`}></i>
            <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
            {description && <p className="text-text-secondary m-0">{description}</p>}
            {children}
        </div>
    );
}
