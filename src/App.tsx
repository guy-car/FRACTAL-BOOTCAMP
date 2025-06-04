import { useState, useEffect, useMemo } from 'react'
import './App.css'
import {
  findWinningCells
} from './game.ts'
import { ServerTicTacToeApi } from './TicTacToeApi'
import { type GameState } from './game'

import clsx from 'clsx'

function App() {

  const api = useMemo(() => new ServerTicTacToeApi(), [])
  const [game, setGame] = useState<GameState | undefined>()
  const [gameId, setGameId] = useState(null)
  const [winningCells, setWinningCells] = useState([])

  useEffect(() => {
    async function initGame() {
      const response = await fetch('/games', { method: 'POST' })
      const data = await response.json()
      console.log('data is: ', data);
      
      setGameId(data.gameId)
      setGame(data.game)
    }
    initGame()
  }, [])

  async function handleCellClick(index: number) {

    // User can no longer click if game is won or tie
    if (!game || game.endState !== undefined) return

    try {
      const response = await fetch(`/games/${gameId}/moves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cellIndex: index })
      })
      const data = await response.json()
      setGame(data.game)

      // check for winning cells
      if (data.game.endState === 'x' || data.game.endState === 'o') {
        const winningC = findWinningCells(data.game)
        setWinningCells(winningC)
      }
    } catch (error) {
      console.error('Move failed:', error)
    }
  }

  console.log('game is: ', game)

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
