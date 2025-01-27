import dots from '../assets/dots.svg';
import dots_hover from '../assets/dots-hover.svg';
import { Link } from "react-router-dom";

import Search from "./Search";
import NavbarTabsList from "./NavbarTabsList";
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../store/slices/menuSlice';
import { useState } from 'react';
import AuthModal from './modals/AuthModal';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import ProfileBar from './ProfileBar';


const NavBar: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); 

    const handleMenuOpen = () => {
        dispatch(toggleMenu());
    };

    const handleLogout = () => {
        dispatch(logout()); 
        localStorage.removeItem('token');
    };

    return (
        <>
            <nav className="bg-header pt-2 pb-2 fixed top-0 left-0 w-full z-50">
                <div className="md:container md:mx-auto">
                    <div className="flex justify-between">
                        <div className="flex gap-[30px]">
                        <button onClick={handleMenuOpen} className="relative group">
                            <img
                                src={dots}
                                alt="menu"
                                className="group-hover:hidden"
                            />
                            <img
                                src={dots_hover}
                                alt="menu hover"
                                className="hidden group-hover:block"
                            />
                        </button>
                            <button>
                                <Link to="/" className="block text-center">
                                    <div className="font-logo text-3xl" style={{ lineHeight: '1' }}>
                                        Fancy<br />Games
                                    </div>
                                </Link>
                            </button>
                        </div>
                        <Search />
                        <div className="flex items-center gap-[30px]">
                            {isAuthenticated &&                                
                               <ProfileBar />                          
                            }
                            
                            <button 
                                className="flex items-center justify-center px-4 py-3 bg-light rounded ml-7 font-main text-base leading-none hover:bg-hover-btn hover:text-header transition-colors duration-400"
                                onClick={isAuthenticated ? handleLogout : () => setIsAuthModalOpen(true)}
                            >
                                {isAuthenticated ? 'Logout' : 'Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="h-[70px]"></div>
            <NavbarTabsList />
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </>
    );
};



export default NavBar;