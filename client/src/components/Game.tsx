import React from 'react';
import { useParams } from 'react-router-dom';
import useGame from '../hooks/useGame'; 
import Comments from './Comments';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gameId = Number(id);
  const {
    isLoading,
    isFavorite,
    toggleFavorite,
    startGame,
    playGame,
    pauseGame,
    playerRef,
    gameNotFound,
    game,
  } = useGame(gameId); 

  const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20 h-20 border-4 border-light border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (gameNotFound) {
    return <p>Game not found</p>;
  }

  return (
    <div className={`mt-12 transform ${menuOpen ? 'ml-[16.67%]' : 'ml-0'}`}>
      <h1 className="text-center text-4xl font-bold">{game.title}</h1>

      <div
        id="flash-container"
        className="mt-10 relative mx-auto bg-black rounded-lg overflow-hidden"
        style={{
          width: '1000px',
          height: '600px',
          position: 'relative',
        }}
      >
        <button
          id="startButton"
          onClick={startGame}
          className="absolute inset-0 m-auto w-[200px] h-[60px] bg-blue-600 text-white font-bold rounded-lg hover:bg-light transition duration-200"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Start Flash Game
        </button>
      </div>

      <div className="mt-10 flex justify-center gap-10">
        <button
          id="playButton"
          onClick={playGame}
          className="px-4 py-2 text-[20px] bg-green-500 text-white rounded hover:bg-green-600"
        >
          Play
        </button>
        <button
          id="pauseButton"
          onClick={pauseGame}
          className="px-4 py-2 text-[20px] bg-red-500 text-white rounded hover:bg-red-600"
        >
          Pause
        </button>

        {game && (
          <button
            onClick={toggleFavorite}
            className={`ml-10 px-4 py-2 text-[20px] rounded ${
              isFavorite ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-light hover:bg-hover-btn hover:text-nav'
            } text-white`}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        )}
      </div>

      <div className="sm:container mx-auto mt-24">
        <p className="text-center">{game.description}</p>
      </div>

      <div className="sm:container mx-auto mt-20">
        <Comments />
      </div>
    </div>
  );
};

export default Game;
