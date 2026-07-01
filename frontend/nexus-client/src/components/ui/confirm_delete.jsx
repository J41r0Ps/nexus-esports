import Modal from './modal';

function ConfirmDelete({ isOpen, onClose, onConfirm, itemName, isDeleting }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
            <div className="confirm-delete">
                <div className="confirm-delete-icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <p className="confirm-delete-text">
                    Are you sure you want to delete <strong>{itemName}</strong>?
                    This action cannot be undone.
                </p>
                <div className="modal-actions">
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