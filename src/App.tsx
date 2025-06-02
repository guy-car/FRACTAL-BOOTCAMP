import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const initialGame = [null, null, null, null, null, null, null, null, 'x']

  const [game, setGame] = useState(initialGame)
  const [currentPlayer, setCurrentPlayer] = useState('x')

  const clickHandler = (index) => {
    const newGame = structuredClone(game)
    console.log('I was clicked', index)

    if (game[index] !== null)
      return console.log("can't click there buddy")

    newGame[index] = currentPlayer
    setGame(newGame)
    playerWins(newGame, currentPlayer)? console.log('Game won!') : null
    setCurrentPlayer(currentPlayer === 'x'? 'o' : 'x')
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

  const playerWins = (game, currentPlayer) => {
    return wonGame.some((wonGame) => wonGame.every((cellIndex) => game[cellIndex] === currentPlayer))
  }
    
  const boardEl = game.map((cell, index) => 
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
