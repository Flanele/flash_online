import React, { useEffect } from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from './store/slices/authSlice';
import { useCheckAuthQuery } from './store/services/authApi';
import { useFetchFavoritesQuery } from './store/services/favoriteApi';
import { setFavoriteGames } from './store/slices/favoritesSlice';
import socket from './socket/socket';
import { useGetFriendsListQuery } from './store/services/friendApi';
import { setFriends } from './store/slices/friendsSlice';


const App: React.FC = () => {
  const dispatch = useDispatch();
  const { data: authData, error: authError, isLoading: authLoading } = useCheckAuthQuery();
  const { data: favoritesData, isLoading: favoritesLoading } = useFetchFavoritesQuery(undefined, { skip: !authData });
  const { data: friendsData, isLoading: friendsLoading } = useGetFriendsListQuery(undefined, { skip: !authData });

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
        socket.emit('login', authData.id);
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

  useEffect(() => {
    if (friendsData?.friends) {
        const accepted = friendsData.friends
            .filter(friend => friend.status === 'accepted')
            .map(friend => friend.friendId);

        const pending = friendsData.friends
            .filter(friend => friend.status === 'pending')
            .map(friend => friend.friendId);

        dispatch(setFriends({ accepted, pending }));
    }
  }, [friendsData, dispatch]);


  useEffect(() => {
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('receive_message', (message) => {
      console.log('Message received:', message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (authLoading || favoritesLoading || friendsLoading) return <div>Loading...</div>;

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

