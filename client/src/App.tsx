import React, { useEffect } from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from './store/slices/authSlice';
import { useCheckAuthQuery } from './store/services/authApi';
import { useFetchFavoritesQuery } from './store/services/favoriteApi';
import { setFavoriteGames } from './store/slices/favoritesSlice';


const App: React.FC = () => {
  const dispatch = useDispatch();
  const { data: authData, error: authError, isLoading: authLoading } = useCheckAuthQuery();
  const { data: favoritesData, isLoading: favoritesLoading } = useFetchFavoritesQuery(undefined, { skip: !authData });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (authData) {
        dispatch(
          setAuth({
            token,
            user: {
              id: authData.id,
              email: authData.email,
              role: authData.role,
              username: authData.username,
              avatar_url: authData.avatar_url,
            },
          })
        );
      } else if (authError) {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  }, [authData, authError, dispatch]);

  useEffect(() => {
    if (favoritesData) {
      const favoriteIds = favoritesData.map((game) => game.gameId);
      dispatch(setFavoriteGames(favoriteIds)); 
    }
  }, [favoritesData, dispatch]);

  if (authLoading || favoritesLoading) return <div>Loading...</div>;

  return (

       <>
        <header>
          <NavBar />
        </header>
        <main>
          <AppRouter />
        </main>
      </>

  );
};

export default App;

