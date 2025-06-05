import { useLoaderData, Link, useNavigate } from 'react-router'
import { useState, useMemo } from "react"
import type { Game } from "../game"
import { ClientTicTacToeApi } from '../api'


function GameLobby() {

    const api = useMemo(() => new ClientTicTacToeApi(), [])

    const { games: initialGames } = useLoaderData<{ games: Game[] }>()

    const [games, setGames] = useState<Game[]>(initialGames)
    const [showGames, setShowGames] = useState<boolean>(false)

    const navigate = useNavigate()

    const gamesEl = () => {
        if (!showGames) return null
        
        return games.map(game => (
            <div key={game.id} className='game-link'>
                <Link to={`/game/${game.id}`}>{game.id}</Link>
            </div>
        ))
    }


    const createNewGame = () => {

    async function initGame() {
      const game = await api.createGame()
      console.log('game is: ', game)
      navigate(`/game/${game.id}`)
    }
    initGame()
  }

    return (
        <div className='lobby'>
            <h3>Welcome to the Game Lobby</h3>
            <button onClick={createNewGame}>Start New Game</button>
            <br></br>
            <button onClick={() => setShowGames(!showGames)}>Load Games</button>
            <br></br>
            {gamesEl()}
        </div>
    )
}

export default GameLobby