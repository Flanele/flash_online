import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchGameQuery } from '../store/services/api';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import { useRef } from "react";

const Game: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: game, error, isLoading } = useFetchGameQuery(Number(id));
    const menuOpen = useSelector((state: RootState) => state.menu.menuOpen);
    const playerRef = useRef<any>(null); 

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-20 h-20 border-4 border-light border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    const startGame = async () => {
        const container = document.querySelector("#flash-container");
        const startButton = document.querySelector("#startButton") as HTMLElement | null;
        if (container && startButton && game?.file_url) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();

            playerRef.current = player;

            player.style.width = "100%";
            player.style.height = "100%";
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

    if (error) {
        if ('status' in error) {
            return (
                <p>
                    Error: {error.status} - {error.data ? JSON.stringify(error.data) : 'No additional error data'}
                </p>
            );
        } else {
            return <p>Error: {error.message}</p>;
        }
    }
    if (!game) return <p>Game not found</p>;

    return (
        <div className={`mt-14  transform ${menuOpen ? 'ml-[16.67%]' : 'ml-0'}`}>
            <h1 className="text-center text-4xl font-bold">{game.title}</h1>

            <div
                id="flash-container"
                className="mt-12 relative mx-auto bg-black rounded-lg overflow-hidden"
                style={{
                    width: '900px', 
                    height: '550px',
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
            </div>
            
            <div className='sm:container mx-auto mt-20'>
                <p className='text-center'>{game.description}</p>
            </div>           
        </div>
    );
};

export default Game;
