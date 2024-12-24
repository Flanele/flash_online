import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../store/services/api';

const apiUrl: string = import.meta.env.VITE_APP_API_URL;

interface GameListProps {
    games: Game[] | undefined; 
    isLoading: boolean;
    error: any;
    menuOpen?: boolean; 
};

const GameList: React.FC<GameListProps> = ({ games, isLoading, error, menuOpen = false }) => {
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
        if ("status" in error) {
            const errorMessage = typeof error.data === "string" ? error.data : "Something went wrong";
            return <p>Error: {error.status} - {errorMessage}</p>;
        }

        return <p>An unexpected error occurred: {String(error)}</p>;
    }

    if (!games || games.length === 0) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <p>No games found.</p>
            </div>
        );        
    }

    const sortedGames = [...games].sort((a, b) => b.popularity_score - a.popularity_score);

    return (
        <div className={`transition-all duration-200 ease-in-out transform ${menuOpen ? 'ml-[16.67%]' : 'ml-0'}`}>
            <div className="md:container mx-auto mt-20">
                <ul className="flex justify-center flex-wrap gap-[60px]">
                    {sortedGames.map((game) => (
                        <li key={game.id} className="relative group">
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 w-[300px] h-[200px] rounded-xl">
                                    <div className="w-8 h-8 border-t-4 border-header border-solid rounded-full animate-spin"></div>
                                </div>
                            )}

                            <Link to={`/game/${game.id}`} className="relative block w-[300px] h-[200px]">
                                <img
                                    src={`${apiUrl}/${game.preview_url}`}
                                    alt={game.title}
                                    className="w-full h-full rounded-xl"
                                    onLoad={handleImageLoad}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                                    {game.popularity_score} {game.popularity_score === 1 ? 'user' : 'users'} added to favorites
                                </div>
                                
                            </Link>

                            <Link to={`/game/${game.id}`}>
                                <h2 className="mt-3 text-center text-[20px] break-words max-w-[300px] hover:text-header">
                                    {game.title}
                                </h2>
                            </Link>
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GameList;


