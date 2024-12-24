import { useState } from "react";
import { useFetchGenresQuery } from "../store/services/genreApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FAVORITE_ROUTE, HOME_ROUTE } from "../utils/consts";
import { setGenre } from "../store/slices/filterGenreSlice";
import { RootState } from "../store/store";

const useNavbarTabsList = () => {
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

    return { 
        activeTab, 
        handleGenreSelect, 
        handleFavoritesClick, 
        isLoading, 
        error, 
        genres, 
        menuOpen, 
        isAuthenticated 
    };
};

export default useNavbarTabsList;