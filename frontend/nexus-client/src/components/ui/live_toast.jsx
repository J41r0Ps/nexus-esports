import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLiveUpdates } from '@/context/live_updates_context';

/**
 * Site-wide banner for live match results pushed over SignalR. Reads the latest
 * update from the LiveUpdates context, auto-dismisses after 8s, and links to the
 * relevant tournament bracket. Mounted once, in the Layout.
 */
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
        <div role="status" className="fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:min-w-[320px] sm:max-w-[400px] p-5 rounded-md border border-neon-green bg-gradient-to-br from-bg-secondary to-bg-tertiary shadow-[0_0_30px_rgba(0,255,148,0.3),var(--shadow-card)] z-[3000] animate-live-in">
            <div className="flex items-center gap-2 mb-3">
                <span className="live-dot"></span>
                <span className="font-heading text-[0.7rem] tracking-[0.2em] text-neon-green">LIVE MATCH UPDATE</span>
            </div>
            <div className="text-text-primary text-[0.95rem] mb-4 leading-normal">
                <strong className="text-neon-cyan">{latestUpdate.winnerName}</strong> defeated{' '}
                <strong className="text-neon-cyan">
                    {latestUpdate.winnerName === latestUpdate.team1Name
                        ? latestUpdate.team2Name
                        : latestUpdate.team1Name}
                </strong>
            </div>
            <div className="flex gap-2">
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
