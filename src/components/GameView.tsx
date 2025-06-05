import { useState, useMemo } from 'react'
import { findWinningCells } from '../game.ts'
import { ClientTicTacToeApi } from '../api.ts'
import { type Game } from '../game'
import { useLoaderData } from 'react-router'

import clsx from 'clsx'


function GameView() {
    const api = useMemo(() => new ClientTicTacToeApi(), [])
    const [winningCells, setWinningCells] = useState<number[] | null>([])

    const { game: initialGame } = useLoaderData<{ game: Game }>()

    const [gameState, setGameState] = useState<Game | undefined>(initialGame)

//   useEffect(() => {

//     async function initGame() {
//       const game = await api.createGame()
//       console.log('game is: ', game)
//       setGameState(game)
//       setGameId(game.id)
//     }
//     initGame()

//   }, [])

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

  if (!gameState) return <div>Loading...</div>

  const boardEl = gameState.board.map((cell, index) => {
      const cellClass = clsx({
      ['cell'] : true,
      ['cell-won'] : winningCells?.includes(index)
    })
    return (
    <div key={index} onClick={() => handleCellClick(index)} className={cellClass}>
      <p>{cell}</p>
    </div>
    )
  })

  return (
      <div className='game-section'>
        <div className="game-board">
          {boardEl}
        </div>
        <div className='current-player'>
          <h3>Current player: <br></br>{gameState.currentPlayer}</h3>
        </div>
      </div>
  )
}

export default GameView
