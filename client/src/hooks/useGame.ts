import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../store/services/favoriteApi';
import { RootState } from '../store/store';
import { addGameToFavorites, removeGameFromFavorites } from '../store/slices/favoritesSlice';
import { useFetchGameQuery } from '../store/services/api';

interface UseGameResult {
  isLoading: boolean;
  isFavorite: boolean;
  toggleFavorite: () => void;
  startGame: () => void;
  playGame: () => void;
  pauseGame: () => void;
  playerRef: React.RefObject<any>;
  gameNotFound: boolean;
  game: any;
}

const useGame = (gameId: number): UseGameResult => {
  const favoriteGames = useSelector((state: RootState) => state.favorites.favoriteGames);
  const isAuthenticated = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const playerRef = useRef<any>(null);

  const { data: game, error, isLoading } = useFetchGameQuery(gameId);

  const gameNotFound = !game;

  useEffect(() => {
    if (game) {
      setIsFavorite(favoriteGames.includes(gameId));
    }
  }, [favoriteGames, gameId, game]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites({ gameId }).unwrap();
        dispatch(removeGameFromFavorites(gameId));
      } else {
        await addToFavorites({ gameId }).unwrap();
        dispatch(addGameToFavorites(gameId));
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const startGame = async () => {
    const container = document.querySelector('#flash-container');
    const startButton = document.querySelector('#startButton') as HTMLElement | null;
    if (container && startButton && game?.file_url) {
      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();

      playerRef.current = player;

      player.style.width = '100%';
      player.style.height = '100%';
      container.appendChild(player);

      player.load(game.file_url);
      player.play();

      startButton.style.display = 'none';
    }
  };

  const playGame = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  const pauseGame = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  return {
    isLoading,
    isFavorite,
    toggleFavorite,
    startGame,
    playGame,
    pauseGame,
    playerRef,
    gameNotFound,
    game,
  };
};

export default useGame;
