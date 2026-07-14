import Modal from './modal';

/**
 * Confirmation dialog for destructive deletes. Shows the item name and disables
 * both buttons (with a spinner on Delete) while `isDeleting` is true.
 */
function ConfirmDelete({ isOpen, onClose, onConfirm, itemName, isDeleting }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
            <div className="text-center">
                <div className="w-[70px] h-[70px] mx-auto mb-6 rounded-full bg-neon-pink/10 border-2 border-neon-pink/30 flex items-center justify-center text-[2rem] text-neon-pink">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <p className="text-text-secondary leading-relaxed mb-0">
                    Are you sure you want to delete <strong className="text-text-primary">{itemName}</strong>?
                    This action cannot be undone.
                </p>
                <div className="flex flex-wrap gap-4 justify-end mt-8 pt-6 border-t border-border-default">
                    <button className="btn-neon" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </button>
                    <button
                        className="btn-danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <><span className="btn-spinner"></span> Deleting...</>
                        ) : (
                            <><i className="bi bi-trash-fill me-2"></i> Delete</>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmDelete;
