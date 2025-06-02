import { useState, useEffect } from 'react'
import './App.css'
import { initialGameState, 
  isValidMove, 
  makeMove,
  switchPlayer,
  checkEndState,
  playerWins
} from './game.ts'

import clsx from 'clsx'

function App() {

  const [game, setGame] = useState(initialGameState())

  const clickHandler = (index) => {

    // User can no longer click if game is won or tie
    if (game.endState !== undefined) return

    // User can only click on empty cells
    if (!isValidMove(game, index))
      return console.log("can't click there buddy")

    // Player makes a move
    const newGame = makeMove(game, index)

    // Check state of game after player made a move
    const endState = checkEndState(newGame)

    // Check if game is won
    if (endState === 'x' || endState === 'o') {
      newGame.endState = endState
      // console.log(`Player ${newGame.currentPlayer} wins!`)
      const winningCells = playerWins(newGame)
      console.log('Winning cells: ', winningCells)
    }

    // Check if game is a tie
    if (endState === 'tie') {
      newGame.endState = endState
      console.log("it's a tie!")
    }

    // Game continues, switching player
    const nextPlayer = switchPlayer(newGame.currentPlayer)
    newGame.currentPlayer = nextPlayer
    setGame(newGame)
  }

  const cellClass = clsx({
    ['cell'] : true,
    ['cell-won'] : game.endState === 'x' || game.endState === 'o'
  })
    
  const boardEl = game.board.map((cell, index) => 
  <div key={index} onClick={() => clickHandler(index)} className={cellClass}><p>{cell}</p></div>
  )

  console.log('gameEndState is: ', game.endState)

  return (
    <div className='main-section'>
      <h1>Tic Tac Toe</h1>
      <div className="game-board">
        {boardEl}
      </div>
    </div>
  )
}

export default App
