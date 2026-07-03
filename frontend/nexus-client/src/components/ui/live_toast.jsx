import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLiveUpdates } from '@/context/live_updates_context';

function LiveToast() {
    const { latestUpdate, clearUpdate } = useLiveUpdates();
    const navigate = useNavigate();

    useEffect(() => {
        if (!latestUpdate) return;
        const timer = setTimeout(clearUpdate, 8000); // longer since it's important
        return () => clearTimeout(timer);
    }, [latestUpdate, clearUpdate]);

    if (!latestUpdate) return null;

    const handleGoTo = () => {
        navigate(`/tournaments/${latestUpdate.tournamentId}`);
        clearUpdate();
    };

    return (
        <div className="live-toast">
            <div className="live-toast-header">
                <span className="live-dot"></span>
                <span className="live-toast-label">LIVE MATCH UPDATE</span>
            </div>
            <div className="live-toast-body">
                <strong>{latestUpdate.winnerName}</strong> defeated{' '}
                <strong>
                    {latestUpdate.winnerName === latestUpdate.team1Name
                        ? latestUpdate.team2Name
                        : latestUpdate.team1Name}
                </strong>
            </div>
            <div className="live-toast-actions">
                <button className="btn-neon-primary btn-sm" onClick={handleGoTo}>
                    <i className="bi bi-eye-fill me-1"></i> View Bracket
                </button>
                <button className="btn-clear btn-sm" onClick={clearUpdate}>
                    Dismiss
                </button>
            </div>
        </div>
    );
}

export default LiveToast;