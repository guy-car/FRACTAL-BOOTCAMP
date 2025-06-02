import { useState, useEffect } from 'react'
import './App.css'
import { initialGameState, 
  isValidMove, 
  makeMove,
  playerWins,
  switchPlayer
} from './game.ts'

function App() {

  const [game, setGame] = useState(initialGameState())

  const clickHandler = (index) => {

        // User can only click on empty cells
    if (!isValidMove(game, index))
      return console.log("can't click there buddy")

    // Player makes a move
    const newGame = makeMove(game, index)

    // If game is over, user can no-longer click
    if (playerWins(newGame)) {
      console.log('Game won!')
    }

    // Game continues, switching player
    const nextPlayer = switchPlayer(newGame.currentPlayer)
    newGame.currentPlayer = nextPlayer
    setGame(newGame)
    
  }

  const wonGame = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal from top-left to bottom-right
    [2, 4, 6]  // diagonal from top-right to bottom-left
]

  const playerWins = (game) => {
    return wonGame.some((wonGame) => wonGame.every((cellIndex) => game.board[cellIndex] === game.currentPlayer))
  }
    
  const boardEl = game.board.map((cell, index) => 
  <div key={index} onClick={() => clickHandler(index)} className='cell'>{cell}</div>
  )

  
  return (
    <>
    <h1>Tic Tac Toe</h1>
    <div className="game-board">
      {boardEl}
    </div>

    </>
  )
}

export default App
