import { useLoaderData } from 'react-router'
import { useState } from "react"
import type { Game } from "../game"

function GameLobby() {

    const { games: initialGames } = useLoaderData<{ games: Game[] }>()

    const [games, setGames] = useState<Game[]>(initialGames)

    const gamesEl = games.map(game => {
        return (
            <p key={game.id}>{game.id}</p>
        )
    })

    return (
        <>
            <h1>Tic Tac Toe</h1>
            <h3>Welcome to the Game Lobby</h3>
            {gamesEl}
        </>
    )
}

export default GameLobby