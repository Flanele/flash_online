import { useParams } from "react-router-dom";
import { useAddCommentMutation, useGetCommentsQuery } from "../store/services/commentApi";
import React, { useState } from "react";
import { format } from "date-fns";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Comments: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const numericGameId = Number(id);

    const { data: comments, isLoading, error, refetch } = useGetCommentsQuery(numericGameId);
    const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

    console.log(comments);

    const [newComment, setNewComment] = useState("");

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await addComment({ text: newComment, gameId: numericGameId });
                setNewComment("");
                refetch();
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    if (isLoading) return <div className="text-center py-4">Loading comments...</div>;

    const getInitials = (username: string) => {
        return username
            .split(" ")
            .map((namePart) => namePart.charAt(0).toUpperCase())
            .join("");
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {comments && (
                <div className="space-y-3 mb-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-4 p-4 bg-nav shadow-md rounded-lg text-light">
                                <div className="flex-shrink-0">
                                    {comment.user.avatar_url ? (
                                        <img
                                            src={`${apiUrl}/${comment.user.avatar_url}`}
                                            alt={comment.user.username}
                                            className="w-16 h-16 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full text-xl font-semibold text-nav">
                                            {getInitials(comment.user.username)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-lg font-semibold">{comment.user.username}</p>
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
            )}
    
            <div className="mt-6">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 text-nav rounded-md bg-lighter focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-light transition-all"
                rows={4}
            />
            <button
                onClick={handleAddComment}
                disabled={isAdding}
                className="mt-3 w-full py-3 bg-light text-white rounded-md hover:bg-hover-btn hover:text-nav focus:outline-none disabled:bg-blue-300 transition-colors duration-300"
            >
                {isAdding ? "Adding..." : "Add Comment"}
            </button>
        </div>

        </div>
    );
    
    
};

export default Comments;
