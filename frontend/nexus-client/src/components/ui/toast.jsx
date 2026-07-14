import { useEffect } from 'react';

const config = {
    success: { border: 'border-l-neon-green', icon: 'text-neon-green', bi: 'bi-check-circle-fill' },
    error: { border: 'border-l-neon-pink', icon: 'text-neon-pink', bi: 'bi-x-circle-fill' },
    info: { border: 'border-l-neon-cyan', icon: 'text-neon-cyan', bi: 'bi-info-circle-fill' },
};

/**
 * Transient notification pinned bottom-right; auto-dismisses after 3.5s.
 *
 * @param {{ message: string, type?: 'success'|'error'|'info', onClose: ()=>void }} props
 */
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const { border, icon, bi } = config[type] || config.success;

    return (
        <div
            role="status"
            className={`fixed bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:min-w-[300px] sm:max-w-[400px] flex items-center gap-3 py-4 px-5 rounded-md border border-border-default border-l-[3px] ${border} bg-bg-secondary text-text-primary text-[0.9rem] z-[3000] shadow-[var(--shadow-card)] animate-toast-in`}
        >
            <i className={`bi ${bi} text-xl ${icon}`}></i>
            <span>{message}</span>
            <button
                aria-label="Dismiss notification"
                className="bg-transparent border-0 text-text-muted cursor-pointer p-1 ml-auto transition-colors duration-150 hover:text-text-primary"
                onClick={onClose}
            >
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
}

export default Toast;
