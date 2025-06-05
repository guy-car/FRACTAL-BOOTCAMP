import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { findWinningCells } from './game.ts'
import { ServerTicTacToeApi } from './api.ts'
import { type Game } from './game'

import clsx from 'clsx'

function App() {

  const api = useMemo(() => new ServerTicTacToeApi(), [])
  const [game, setGame] = useState<Game | undefined>()
  const [gameId, setGameId] = useState<string | null>(null)
  const [winningCells, setWinningCells] = useState<number[] | null>([])

  useEffect(() => {

    async function initGame() {
      const game = await api.createGame()
      console.log('game is: ', game)
      setGame(game)
      setGameId(game.id)
    }
    initGame()

  }, [])

  async function handleCellClick(index: number) {

    // User can no longer click if game is won or tie
    if ( game?.endState) return

    try {
      const updatedGame = await api.makeMove(gameId!, index)
      setGame(updatedGame)

      if (updatedGame.endState === 'x' || updatedGame.endState === 'o') {
        const winningC = findWinningCells(updatedGame)
        setWinningCells(winningC)
      }
    } catch (error) {
      console.error('Move failed:', error)
    }
  }

  if (!game) return <div>Loading...</div>

  const boardEl = game.board.map((cell, index) => {
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
    <div className='main-section'>
      <h1>Tic Tac Toe</h1>
      <div className='game-section'>
        <div className="game-board">
          {boardEl}
        </div>
        <div className='current-player'>
          <h3>Current player: <br></br>{game.currentPlayer}</h3>
        </div>
      </div>
    </div>
  )
}

export default App
