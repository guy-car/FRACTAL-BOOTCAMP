import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { findWinningCells } from '../game.ts'
import { ClientTicTacToeApi } from '../api.ts'
import { type Game } from '../game'
import { useLoaderData } from 'react-router'
import { io } from "socket.io-client";
import { GAME_UPDATED, USER_JOINED } from "../../constants";
import clsx from 'clsx'

function GameView() {

    const api = useMemo(() => new ClientTicTacToeApi(), [])
    const [winningCells, setWinningCells] = useState<number[] | null>([])

    const { game: initialGame } = useLoaderData<{ game: Game }>()

    const [gameState, setGameState] = useState<Game | undefined>(initialGame)

    const navigate = useNavigate()


  async function handleCellClick(index: number) {

    // User can no longer click if game is won or tie
    if ( gameState?.endState) return

    try {
      const updatedGame = await api.makeMove(gameState!.id, index)
      setGameState(updatedGame)

      if (updatedGame.endState === 'x' || updatedGame.endState === 'o') {
        const winningC = findWinningCells(updatedGame)
        setWinningCells(winningC)
      }
    } catch (error) {
      console.error('Move failed:', error)
    }
  }

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BACKEND_URL);
        socket.on("connect", () => {
            console.log("connected to socket");
            // Join the game room
            socket.emit("join-game", gameState?.id);

            socket.on(USER_JOINED, (userId: string) => {
                console.log(`user ${userId} joined`);
            });
            socket.on(GAME_UPDATED, (game: Game) => {
                console.log("game updated", game);
                setGameState(game);
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    console.log('gameState is: ', gameState)

  if (!gameState) return <div>Loading...</div>

  const redPillImg = <img src='/red_pill.png' alt='Red pill' className='red-pill' />
  const bluePillImg = <img src='/blue_pill.png' alt='Blue pill' className='blue-pill' />

      const bgClass = clsx({
      ['game-section'] : true ,
      ['game-won'] : gameState.endState
    })

  const boardEl = gameState.board.map((cell, index) => {
      const clickedCell = cell !== null
      console.log('cell is :', cell)

      const cellClass = clsx({
      ['cell'] : true,
      ['cell-won'] : winningCells?.includes(index),
      ['cell-clicked'] : clickedCell
    })
    const getCellContent = (cell: string | null) => {
      if (cell === 'x') return bluePillImg
      if (cell === 'o') return redPillImg
      return null
    }
    return (
    <div key={index} onClick={() => handleCellClick(index)} className={cellClass}>
      <p>{getCellContent(cell)}</p>
    </div>
    )
  })

  return (
    <>
        <div className={bgClass}>
            <div className="game-board">
                {boardEl}
            </div>
            <div className='current-player'>
                <h4>Current player: <br></br>{gameState.currentPlayer === 'x'? bluePillImg : redPillImg}</h4>
            </div>
        </div>
        <div className='game-section-options'>
            <button onClick={() => navigate('/')}>Back to Lobby</button>
        </div>
    </>

  )
}

export default GameView
