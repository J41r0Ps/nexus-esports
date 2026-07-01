import { Link } from 'react-router-dom';
import Layout from '@/layout_template';

function NotFoundScreen() {
    return (
        <Layout>
            <div className="not-found">
                <div className="not-found-code text-glow">404</div>
                <h1 className="not-found-title">Signal Lost</h1>
                <p className="not-found-message">
                    The page you're looking for has been eliminated from the bracket.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn-neon">
                        <i className="bi bi-house-fill me-2"></i> Back to Home
                    </Link>
                    <Link to="/tournaments" className="btn-neon btn-neon-violet">
                        <i className="bi bi-trophy-fill me-2"></i> View Tournaments
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default NotFoundScreen;