
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
}) => {
    return (
        <div className="flex justify-between items-center mt-10 mb-6">
            <button
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-light text-nav rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-light text-nav rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
