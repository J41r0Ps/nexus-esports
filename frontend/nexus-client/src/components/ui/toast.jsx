import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        info: 'bi-info-circle-fill'
    };

    return (
        <div className={`toast toast-${type}`}>
            <i className={`bi ${icons[type]}`}></i>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose}>
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
}

export default Toast;