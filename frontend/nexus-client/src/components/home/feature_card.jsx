const accents = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan',
    violet: 'bg-neon-violet/10 text-neon-violet',
    pink: 'bg-neon-pink/10 text-neon-pink',
    green: 'bg-neon-green/10 text-neon-green',
};

/**
 * Feature highlight card: tinted icon tile, title, and a short description.
 */
function FeatureCard({ icon, title, description, accent = 'cyan' }) {
    return (
        <div className="glass-card p-7 h-full">
            <div className={`inline-flex items-center justify-center w-[46px] h-[46px] rounded-sm text-[1.3rem] mb-5 ${accents[accent]}`}>
                <i className={`bi ${icon}`}></i>
            </div>
            <h3 className="text-[1.15rem] font-semibold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary text-[0.92rem] leading-relaxed m-0">{description}</p>
        </div>
    );
}

export default FeatureCard;
