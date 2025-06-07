import { useLoaderData, useNavigate } from 'react-router'
import { useState, useMemo } from "react"
import type { Game } from "../game"
import { ClientTicTacToeApi } from '../api'
import { format } from 'date-fns'

function GameLobby() {

    const api = useMemo(() => new ClientTicTacToeApi(), [])

    const { games: initialGames } = useLoaderData<{ games: Game[] }>()

    const [games] = useState<Game[]>(initialGames)
    const [showGames, setShowGames] = useState<boolean>(false)

    const navigate = useNavigate()

  const redPillImg = <img src='/red_pill.png' alt='Red pill' className='red-pill' />
  const bluePillImg = <img src='/blue_pill.png' alt='Blue pill' className='blue-pill' />

    const gamesEl = () => {
        if (!showGames) return null

        return games.map(game => {

            const isInProgress = game.board.some(cell => cell !== null)
            const isUnplayed = !isInProgress

            const isoDate = game.timeCreated
            const formattedDate = format(new Date(isoDate!), 'MM/dd/yyyy')

            const gameStatus = () => {
                if (isInProgress && !game.endState) return 'in progress'
                if (isUnplayed) return 'unplayed game'
                if (game.endState === 'tie') return 'tie'
                return game.endState === 'x'? bluePillImg : redPillImg
            }

            return (
            <div key={game.id}>
                <button className='load-game-btn' onClick={() => 
                    navigate(`/game/${game.id}`)}
                    >
                        {formattedDate} - {gameStatus()}
                </button>
            </div>
            )
    })
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