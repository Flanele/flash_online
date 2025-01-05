import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UserList from "../UserList";
import { useFriendsModal } from "../../hooks/useFriendsModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface FriendsModalProps {
    onClose: () => void
};

const FriendsModal: React.FC<FriendsModalProps> = ({ onClose }) => {
    const { accepted, pending } = useSelector((state: RootState) => state.friends);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

    const {
        searchTerm,
        setSearchTerm,
        isDeleteConfirmOpen,
        friendToDelete,
        sortedUsers,
        isLoading,
        openDeleteConfirmModal,
        closeDeleteConfirmModal,
        handleAddFriend,
        handleCancelOrDelete,
        handleDeleteFriend,
        setFriendToDelete,
        setIsDeleteConfirmOpen
    } = useFriendsModal();

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-header rounded-lg shadow-lg w-full max-w-3xl h-[90vh] p-10 relative flex flex-col">
                    <button className="absolute top-4 right-4" onClick={onClose}>
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold text-center mb-3">Friends</h2>
                    <h4 className="text-md font-bold text-center mb-8">You can find new friends:</h4>
                    <input
                        type="text"
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value || null)}
                        placeholder="Search for friends"
                        className="mb-6 p-3 border-b-2 border-text bg-transparent focus:outline-none focus:border-purple-400 w-full"
                    />
                    <UserList
                        users={sortedUsers}
                        accepted={accepted}
                        pending={pending}
                        isLoading={isLoading}
                        handleAddFriend={handleAddFriend}
                        handleCancelOrDelete={handleCancelOrDelete}
                        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} 
                        setFriendToDelete={setFriendToDelete} 
                    />
                </div>
                    <DeleteConfirmationModal
                    isOpen={isDeleteConfirmOpen} 
                    onDelete={handleDeleteFriend} 
                    onClose={closeDeleteConfirmModal} 
                />

            </div>
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={enlargedImage}
                            alt="Enlarged avatar"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                        />
                        <button
                            className="absolute top-2 right-2 bg-header rounded-full p-2 shadow-lg"
                            onClick={() => setEnlargedImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};


export default FriendsModal;