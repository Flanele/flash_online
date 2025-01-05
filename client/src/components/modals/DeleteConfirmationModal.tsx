interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onDelete: () => void;
    onClose: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onDelete, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-nav p-6 rounded-lg shadow-lg w-96 text-center">
                <h3 className="text-md mb-6">Are you sure you want to delete this friend?</h3>
                <div className="flex justify-around">
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white"
                    >
                        Yes, delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-lighter text-nav rounded-lg hover:bg-hover-btn"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
