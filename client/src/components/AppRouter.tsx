import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import GamePage from '../pages/GamePage';



const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/game/:id" element={<GamePage />} /> 
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
};

export default AppRouter;