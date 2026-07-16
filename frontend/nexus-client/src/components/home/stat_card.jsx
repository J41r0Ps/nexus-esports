import { useEffect, useState } from 'react';

// Tailwind needs full class literals, so tones are enumerated rather than composed.
const tones = {
    cyan: 'bg-neon-cyan/10 text-neon-cyan',
    violet: 'bg-neon-violet/10 text-neon-violet',
    pink: 'bg-neon-pink/10 text-neon-pink',
    green: 'bg-neon-green/10 text-neon-green',
};

/**
 * Eases a number from 0 to `target` over `duration` ms.
 * Renders the final value immediately when the user prefers reduced motion.
 */
function useCountUp(target, duration = 900) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (target == null) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setValue(target);
            return;
        }
        let frame;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(target * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}

/**
 * Compact stat cell for the hero strip: icon, animated count, uppercase label.
 * Pass `value={null}` while the API count is still loading.
 */
function StatCard({ icon, value, label, tone = 'cyan' }) {
    const count = useCountUp(value);

    return (
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-sm grid place-items-center text-[1.25rem] shrink-0 ${tones[tone]}`}>
                <i className={`bi ${icon}`}></i>
            </div>
            <div>
                <div className="font-heading text-[1.9rem] font-bold leading-none text-text-primary tabular-nums">
                    {value == null ? '—' : count}
                </div>
                <div className="font-heading text-[0.72rem] tracking-[0.15em] uppercase text-text-secondary mt-1">
                    {label}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
