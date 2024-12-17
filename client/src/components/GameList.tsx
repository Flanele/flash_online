import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchGamesQuery } from '../store/services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


const apiUrl: string = import.meta.env.VITE_APP_API_URL;

const GameList: React.FC = () => {
    const selectedGenre = useSelector((state: RootState) => state.filterGenre.genreId);
    const searchTerm = useSelector((state: RootState) => state.filterTerm.searchTerm);
    const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);

    const { data: games, error, isLoading } = useFetchGamesQuery({
        genreId: selectedGenre || null,
        searchTerm: searchTerm || null,
    });

    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-light rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-light rounded-full animate-pulse delay-200"></div>
                    <div className="w-8 h-8 bg-light rounded-full animate-pulse delay-400"></div>
                </div>
            </div>
        );
    }

    if (error) {
        if ('status' in error) {
            const errorMessage = typeof error.data === 'string' ? error.data : 'Something went wrong';
            return <p>Error: {error.status} - {errorMessage}</p>;
        }

        return <p>An unexpected error occurred: {String(error)}</p>;
    }

    return (
        <div className={`transition-all duration-200 ease-in-out transform ${menuOpen ? 'ml-[16.67%]' : 'ml-0'}`}>
            <div className="md:container mx-auto mt-20">
                <ul className="flex justify-center flex-wrap gap-[60px]">
                    {games?.map((game) => (
                        <li key={game.id} className="relative">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 w-[300px] h-[200px] rounded-xl">
                                    <div className="w-8 h-8 border-t-4 border-header border-solid rounded-full animate-spin"></div>
                                </div>
                            )}

                            <Link to={`/game/${game.id}`}>
                                <img
                                    src={`${apiUrl}/${game.preview_url}`}
                                    alt={game.title}
                                    className="w-[300px] h-[200px] rounded-xl"
                                    onLoad={handleImageLoad}
                                />
                                <h2 className="mt-3 text-center text-[20px] break-words max-w-[300px] hover:text-header">{game.title}</h2>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


export default GameList;

