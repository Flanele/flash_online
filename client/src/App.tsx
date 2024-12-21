import React, { useEffect } from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { logout, setAuth } from './store/slices/authSlice';
import { useCheckAuthQuery } from './store/services/authApi';


const App: React.FC = () => {
  const dispatch = useDispatch();
    const { data, error, isLoading } = useCheckAuthQuery();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (data) {
                dispatch(setAuth({
                    token,
                    user: {id: data.id, email: data.email, role: data.role, username: data.username, avatar_url: data.avatar_url }
                }));
            } else if (error) {
                dispatch(logout());
            }
        } else {
            dispatch(logout());
        }
    }, [data, error, dispatch]);

    if (isLoading) return <div>Loading...</div>;

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

