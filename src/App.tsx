import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const initialGame = [
    [null, null, null],
    [null, null, null], 
    [null, null, null]
  ]

  const [game, setGame] = useState(initialGame)

  const boardEl = game.map(row => row.map(cell => <div className='cell'>test</div>
  ))


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
