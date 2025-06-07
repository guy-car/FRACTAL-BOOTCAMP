import { type Game } from './game.ts'
import { initialGameState, makeMove, checkEndState, switchPlayer } from './game.ts'

const BASE_URL = import.meta.env.VITE_BACKEND_URL 

export interface TicTacToeApi {
    createGame(): Promise<Game>
    makeMove(gameId: string, cellIndex: number): Promise<Game>
    getGame(gameId: string): Promise<Game>,
    getGames(): Promise<Game[]>
}

export class ClientTicTacToeApi implements TicTacToeApi {

    async getGames(): Promise<Game[]> {
        const response = await fetch(`${BASE_URL}/api/games`)
        const games = await response.json()
        return games
    }

    async createGame(): Promise<Game> {
        const response = await fetch(`${BASE_URL}/api/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        return data
    }

    async getGame(gameId: string): Promise<Game> {
        const response = await fetch(`${BASE_URL}/api/game/${gameId}`)
        const data = await response.json()
        return data
    }

    async makeMove(gameId: string, cellIndex: number): Promise<Game> {
        const response = await fetch(`${BASE_URL}/api/game/${gameId}/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cellIndex })
        })
        const data = await response.json()
        return data
    }
}

export class InMemoryTicTacToeApi implements TicTacToeApi {
    private games: Map<string, Game> = new Map

    async getGames(): Promise<Game[]> {
        return Array.from(this.games.values())
    }

    async createGame(): Promise<Game> {
        const game = initialGameState()
        this.games.set(game.id, game)
        return game
    }

    async getGame(gameId: string): Promise<Game> {
        const game = this.games.get(gameId)
        if (!game) {
            throw new Error("Game not found")
        }
        return game
    }

    async makeMove(gameId: string, cellIndex: number): Promise<Game> {
        const game = await this.getGame(gameId)

        const updatedGame = makeMove(game, cellIndex)
        const endState = checkEndState(updatedGame)

        if (endState) {
            updatedGame.endState = endState
        } else {
            updatedGame.currentPlayer = switchPlayer(updatedGame.currentPlayer)
        }

        this.games.set(gameId, updatedGame)
        return updatedGame
    }

}