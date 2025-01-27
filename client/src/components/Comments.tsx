import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { format } from "date-fns";
import useComments from "../hooks/useComments";
import Pagination from "./Pagination";
import { useFriendsModal } from "../hooks/useFriendsModal";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Comments: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const numericGameId = Number(id);
    const { accepted, pending } = useSelector((state: RootState) => state.friends);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const {
        comments,
        totalPages,
        currentPage,
        isLoading,
        error,
        newComment,
        setNewComment,
        handleAddComment,
        isAdding,
        handleNextPage,
        handlePreviousPage,
    } = useComments(numericGameId);

    const { handleAddFriend } = useFriendsModal();
    const [activeUser, setActiveUser] = useState<number | null>(null);

    const togglePopover = (userId: number) => {
        setActiveUser(activeUser === userId ? null : userId);
    };

    const getInitials = (username: string) => {
        return username
            .split(" ")
            .map((namePart) => namePart.charAt(0).toUpperCase())
            .join("");
    };

    const getFriendStatus = (userId: number) => {
        if (accepted.includes(userId)) return "Friend";
        if (pending.includes(userId)) return "Request Sent";
        return "Add Friend";
    };

    if (isLoading) return <div className="text-center py-4">Loading comments...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <div className="space-y-3 mb-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="relative flex items-start space-x-4 p-4 bg-nav shadow-md rounded-lg text-light">
                            <div className="flex-shrink-0 relative">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => togglePopover(comment.user.id)}
                                >
                                    {comment.user.avatar_url ? (
                                        <img
                                            src={`${apiUrl}/${comment.user.avatar_url}`}
                                            alt={comment.user.username}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-xl font-semibold text-nav">
                                            {getInitials(comment.user.username)}
                                        </div>
                                    )}
                                </div>
                                {isAuthenticated && user && comment.user.id !== user.id && activeUser === comment.user.id && (
                                    <div className="absolute top-20 left-0 bg-lighter text-nav shadow-lg rounded-lg w-40 z-50">
                                        <button
                                            className={`w-full text-left text-sm p-2 rounded-lg ${
                                                accepted.includes(comment.user.id)
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-purple-300"
                                            }`}
                                            disabled={accepted.includes(comment.user.id) || pending.includes(comment.user.id)}
                                            onClick={() => handleAddFriend(comment.user.id)}
                                        >
                                            {getFriendStatus(comment.user.id)}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p
                                        className="text-lg font-semibold cursor-pointer hover:underline"
                                        onClick={() => togglePopover(comment.user.id)}
                                    >
                                        {comment.user.username}
                                    </p>
                                    <p className="text-sm text-light">
                                        {format(new Date(comment.createdAt), "MMMM d, yyyy HH:mm")}
                                    </p>
                                </div>
                                <p className="mt-2 text-lg text-lighter">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No comments available</p>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
            />

            <div className="mt-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={isAuthenticated ? "Add a comment..." : "Log in to post a comment"}
                    className="w-full p-3 border border-gray-300 text-nav rounded-md bg-lighter focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-light transition-all"
                    rows={4}
                    disabled={!isAuthenticated}
                />
                <button
                    onClick={handleAddComment}
                    disabled={!isAuthenticated || isAdding}
                    className="mt-3 w-full py-3 bg-light text-white rounded-md hover:bg-hover-btn hover:text-nav focus:outline-none disabled:bg-blue-300 transition-colors duration-300"
                >
                    {isAdding ? "Adding..." : "Add Comment"}
                </button>
            </div>
        </div>
    );
};

export default Comments;

