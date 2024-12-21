import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import GamePage from '../pages/GamePage';
import FavoritePage from '../pages/FavoritePage';



const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/game/:id" element={<GamePage />} /> 
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
};

export default AppRouter;