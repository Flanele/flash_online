import { useState } from "react";
import { useFetchGenresQuery } from "../store/services/genreApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FAVORITE_ROUTE, HOME_ROUTE } from "../utils/consts";
import { setGenre } from "../store/slices/filterGenreSlice";

import home from '../assets/home.svg';
import favorites from '../assets/heart.svg';
import { RootState } from "../store/store";

const NavbarTabsList: React.FC = () => {
    const [activeTab, setActiveTab] = useState('home'); 
    const navigate = useNavigate();
    const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); 

    const { data: genres, isLoading, error } = useFetchGenresQuery();
    const dispatch = useDispatch();

    const handleGenreSelect = (genreId: number | null) => {
        dispatch(setGenre(genreId));
        navigate(HOME_ROUTE);
        setActiveTab(genreId ? genreId.toString() : 'home'); 
    };

    const handleFavoritesClick = () => {
        if (isAuthenticated) {
            navigate(FAVORITE_ROUTE);
            setActiveTab('favorites');
        }
    };

    return (
<div
    className={`fixed top-[70px] left-0 bg-nav w-1/6 h-[calc(100vh-70px)] border-r-[2px] border-stroke z-40 transition-transform duration-200 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
    } overflow-y-scroll`}
>
    <ul className="font-main text-center mt-8 text-3xl text-text leading-[3rem] cursor-pointer">
        <li
            className={`font-logo flex items-center justify-center mb-7 hover:text-white transition-all duration-300 ease-in-out ${activeTab === 'home' ? 'bg-header text-white' : ''}`}
            onClick={() => handleGenreSelect(null)}
        >
            <img src={home} alt="Home Icon" className="mr-4 w-6 h-6" />
            <span>Home</span>
        </li>

        <li
            className={`font-logo flex items-center justify-center mb-7 hover:text-white transition-all duration-200 ease-in-out ${activeTab === 'favorites' ? 'bg-header text-white' : ''} ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={isAuthenticated ? handleFavoritesClick : undefined}
            title={!isAuthenticated ? "Log in to get your favorites" : ""}
        >
            <img src={favorites} alt="Favorites Icon" className="mr-4 w-6 h-6" />
            <span>Favorites</span>
        </li>

        <li className="h-[2px] bg-stroke mb-7"></li>

        {isLoading && (
            <div className="flex justify-center items-center my-5">
                <div className="w-8 h-8 border-t-4 border-text border-solid rounded-full animate-spin"></div>
            </div>
        )}
        {error && <p>Error loading genres</p>}
        {genres?.map((genre) => (
            <li
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className={`text-[20px] cursor-pointer transition-all duration-200 ease-in-out hover:text-white ${activeTab === genre.id.toString() ? 'bg-header text-white' : ''}`}
            >
                {genre.name}
            </li>
        ))}
    </ul>
</div>

    
    );
};


export default NavbarTabsList;