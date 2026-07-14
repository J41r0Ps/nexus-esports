import { useEffect, useRef, useState } from 'react';

/**
 * Reveals its children with a fade/slide-up the first time they scroll into
 * view (IntersectionObserver, fires once). Pairs with the `.reveal` /
 * `.reveal-visible` classes in index.css, which also handle reduced motion.
 *
 * @param {{ children: React.ReactNode, delay?: number, className?: string }} props
 *   `delay` staggers the transition in seconds (sets --reveal-delay).
 */
function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -60px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
            style={delay ? { '--reveal-delay': `${delay}s` } : undefined}
        >
            {children}
        </div>
    );
}

export default Reveal;
