import { type Game } from './game.ts'
import { initialGameState, makeMove, checkEndState, switchPlayer } from './game.ts'
import { v4 as uuidv4 } from 'uuid';

export interface TicTacToeApi {
    createGame(): Promise<Game>
    makeMove(gameId: string, cellIndex: number): Promise<Game>
    getGame(gameId: string): Promise<Game>
}

export class ServerTicTacToeApi implements TicTacToeApi {

    async createGame(): Promise<Game> {
        const response = await fetch('/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        return data
    }

    async getGame(gameId: string): Promise<Game> {
        const response = await fetch(`/api/game/${gameId}`)
        const data = await response.json()
        return data
    }

    async makeMove(gameId: string, cellIndex: number): Promise<Game> {
        const response = await fetch(`/api/game/${gameId}/move`, {
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

    async createGame(): Promise<Game> {
        const gameId = uuidv4()
        const game = initialGameState()
        const gameWithId = {...game, id: gameId}
        this.games.set(gameId, gameWithId)
        return gameWithId
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