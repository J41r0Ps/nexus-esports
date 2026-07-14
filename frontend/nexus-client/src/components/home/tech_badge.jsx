/**
 * Small pill naming one technology in the stack (hero badge row).
 */
function TechBadge({ label }) {
    return (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-secondary/60 border border-border-default font-heading text-[0.75rem] font-medium tracking-[0.08em] text-text-secondary transition-colors duration-200 hover:text-text-primary hover:border-border-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet"></span>
            {label}
        </span>
    );
}

export default TechBadge;
