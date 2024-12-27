import React, { useEffect, useState } from 'react';
import searchImg from '../assets/search.svg'; 
import { useFetchGamesQuery } from '../store/services/api';
import useDebounce from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdown, setDropdown] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: games, isLoading } = useFetchGamesQuery(
        { searchTerm: debouncedSearchTerm },
        { skip: debouncedSearchTerm.length < 2 } 
    );

    useEffect(() => {
        setDropdown(debouncedSearchTerm.length > 1 && !!games?.length);
    }, [debouncedSearchTerm, games]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectGame = (game: { id: number; title: string }) => {
        setDropdown(false);
        setSearchTerm('');
    };

    return (
        <div className="relative flex items-center ml-[170px]">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 rounded-full bg-light py-2 pl-4 pr-48 font-main border-2 border-transparent focus:outline-none focus:ring-0 focus:border-hover-btn transition ease"
                placeholder="Search for a game..."
            />
            <img
                src={searchImg}
                alt="search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
            />

            {dropdown && (
                <ul className="absolute left-0 top-[48px] w-full bg-lighter text-light border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto mt-3 z-10">
                    {isLoading ? (
                        <li className="p-3 text-gray-500">Loading...</li>
                    ) : (
                        games?.map((game) => (
                            <Link to={`/game/${game.id}`}>
                                <li
                                key={game.id}
                                onClick={() => handleSelectGame(game)}
                                className="p-3 cursor-pointer hover:bg-hover-btn hover:text-nav transition"
                                >
                                    {game.title}
                                </li>
                            </Link>
                            
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Search;
