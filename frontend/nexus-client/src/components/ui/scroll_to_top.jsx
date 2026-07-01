import { useState, useEffect } from 'react';

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
        <button className="scroll-top-btn" onClick={scrollUp} title="Scroll to top">
            <i className="bi bi-arrow-up"></i>
        </button>
    );
}

export default ScrollToTop;