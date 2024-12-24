import { useState } from "react";
import { useAddCommentMutation, useGetCommentsQuery } from "../store/services/commentApi";

const useComments = (gameId: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);

    const { data, isLoading, error, refetch } = useGetCommentsQuery(
        { gameId, page: currentPage, limit },
        { skip: !gameId }
    );
    const [addComment, { isLoading: isAdding }] = useAddCommentMutation();

    const comments = data?.comments || [];
    const totalComments = data?.totalComments || 0;
    const totalPages = Math.ceil(totalComments / limit);

    const [newComment, setNewComment] = useState("");

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await addComment({ text: newComment, gameId });
                setNewComment("");
                refetch();
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return {
        comments,
        totalComments,
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
    };
};

export default useComments;


