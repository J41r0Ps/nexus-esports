import { useState, useEffect } from 'react';

/** Floating button that appears after scrolling 400px and smooth-scrolls to top. */
function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollUp = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            className="group fixed bottom-8 left-8 z-[1000] grid size-12 place-items-center appearance-none cursor-pointer rounded-full border border-border-glow bg-bg-glass backdrop-blur-md text-lg text-neon-cyan shadow-glow-cyan transition-all duration-200 animate-scroll-in hover:-translate-y-1 hover:border-transparent hover:text-bg-primary hover:bg-gradient-to-br hover:from-neon-cyan hover:to-neon-violet hover:shadow-[0_0_28px_rgba(0,240,255,0.6)]"
            onClick={scrollUp}
            title="Scroll to top"
        >
            <i className="bi bi-arrow-up transition-transform duration-200 group-hover:-translate-y-0.5"></i>
        </button>
    );
}

export default ScrollToTop;
