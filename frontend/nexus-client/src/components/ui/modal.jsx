import { useEffect } from 'react';

const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[550px]',
    lg: 'max-w-[750px]',
};

/**
 * Centered modal dialog. Locks body scroll and closes on Escape or backdrop
 * click while open. Renders nothing when `isOpen` is false.
 *
 * @param {{ isOpen: boolean, onClose: ()=>void, title: string,
 *           children: React.ReactNode, size?: 'sm'|'md'|'lg' }} props
 */
function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => e.key === 'Escape' && onClose();
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/75 backdrop-blur-[8px] z-[2000] flex items-center justify-center py-8 px-4 animate-[fadeIn_0.2s_ease-out]"
            onClick={onClose}
        >
            <div
                className={`w-full ${sizes[size] || sizes.md} max-h-[90vh] overflow-y-auto bg-bg-secondary border border-border-glow rounded-lg shadow-[var(--shadow-card),0_0_40px_var(--neon-cyan-dim)] animate-[modalSlideUp_0.3s_cubic-bezier(0.4,0,0.2,1)]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-border-default">
                    <h3 className="text-[1.25rem] font-semibold text-text-primary m-0">{title}</h3>
                    <button
                        className="w-[34px] h-[34px] bg-transparent border border-border-default text-text-secondary rounded-sm cursor-pointer transition-all duration-150 flex items-center justify-center hover:text-neon-pink hover:border-neon-pink"
                        onClick={onClose}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="p-6 sm:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
