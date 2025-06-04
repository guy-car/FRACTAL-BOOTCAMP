import { Game } from './game'

export interface TicTacToeApi {
    createGame(): Promise<Game>
    makeMove(gameId: number, cellIndex: number): Promise<Game>
}

export class ServerTicTacToeApi implements TicTacToeApi {

    async createGame(): Promise<Game> {
        const response = await fetch('/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        return data.game
    }

    async makeMove(gameId: number, cellIndex: number): Promise<Game> {
        const response = await fetch(`/games/${gameId}/moves`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cellIndex })
        })
        const data = await response.json()
        return data.game
    }
}