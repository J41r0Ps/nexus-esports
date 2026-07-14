import { Link } from 'react-router-dom';
import Layout from '@/layout_template';

function NotFoundScreen() {
    return (
        <Layout>
            <div className="text-center py-16 px-4 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="font-heading text-[clamp(6rem,20vw,12rem)] font-bold leading-none tracking-[-0.05em] animate-glitch text-glow">404</div>
                <h1 className="text-[2rem] mt-4 mb-2 text-text-primary">Signal Lost</h1>
                <p className="text-text-secondary text-[1.1rem] mb-8 max-w-[500px]">
                    The page you're looking for has been eliminated from the bracket.
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <Link to="/" viewTransition className="btn-neon">
                        <i className="bi bi-house-fill me-2"></i> Back to Home
                    </Link>
                    <Link to="/tournaments" viewTransition className="btn-neon btn-neon-violet">
                        <i className="bi bi-trophy-fill me-2"></i> View Tournaments
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default NotFoundScreen;
