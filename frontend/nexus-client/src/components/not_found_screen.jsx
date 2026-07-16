import { Link } from 'react-router-dom';
import Layout from '@/layout_template';

function NotFoundScreen() {
    return (
        <Layout>
            <div className="text-center py-16 px-4 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="font-heading text-[clamp(6rem,20vw,12rem)] font-bold leading-none tracking-[-0.05em] animate-glitch motion-reduce:animate-none text-glow">404</div>
                <h1 className="text-[2rem] mt-4 mb-2 text-text-primary">Signal lost</h1>
                <p className="text-text-secondary text-[1.1rem] mb-8 max-w-[500px]">
                    The page you're looking for has been eliminated from the bracket.
                </p>
                <div className="flex items-center gap-x-7 gap-y-4 flex-wrap justify-center">
                    <Link to="/" viewTransition className="btn-neon-primary no-underline">
                        <i className="bi bi-house-fill me-2"></i> Back to home
                    </Link>
                    <Link to="/tournaments" viewTransition className="inline-flex items-center gap-2 text-neon-cyan font-heading text-[0.85rem] font-semibold uppercase tracking-[0.1em] no-underline hover:gap-3 transition-all duration-200">
                        View tournaments <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default NotFoundScreen;
