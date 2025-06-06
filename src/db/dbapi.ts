import { db } from './index.js';
import { games } from './schema.js';
import { eq, sql } from 'drizzle-orm';
import { initialGameState, makeMove, checkEndState, switchPlayer } from '../game.ts'
import { v4 as uuidv4 } from 'uuid';
import { type Game, type Player, type Board, type EndState } from '../game.ts'
import { type TicTacToeApi } from '../api.js';

export class DbTicTacToeApi implements TicTacToeApi {

    async createGame(): Promise<Game> {
        const gameId = uuidv4()
        const gameData = initialGameState()
        const gameWithId = {...gameData, id: gameId }

        await db.insert(games).values({
            id: gameId,
            board: gameWithId.board,
            currentPlayer: gameWithId.currentPlayer,
            endState: gameWithId.endState || null
        })
        return gameWithId
    }

        async getGames(): Promise<Game[]> {
        const results = await db.select().from(games).orderBy(sql`${games.timeCreated} desc nulls last`).limit(10)
        return results.map(game => ({
            id: game.id,
            currentPlayer: game.currentPlayer as Player,
            board: game.board as Board,
            endState: game.endState as EndState,
            timeCreated: game.timeCreated
        }))
    }

    async getGame(gameId: string): Promise<Game> {
        const [game] = await db.select().from(games).where(eq(games.id, gameId))

        if (!game) {
            throw new Error("Games not found")
        }

        return {
            id: game.id,
            board: game.board as Game['board'],
            currentPlayer: game.currentPlayer as Game['currentPlayer'],
            endState: game.endState as Game['endState']
        }
    }

    async makeMove(gameId: string, cellIndex: number): Promise<Game> {
        const game = await this.getGame(gameId);
        
        const updatedGame = makeMove(game, cellIndex);
        const endState = checkEndState(updatedGame);
        
        if (endState) {
            updatedGame.endState = endState;
        } else {
            updatedGame.currentPlayer = switchPlayer(updatedGame.currentPlayer);
        }
        
        await db.update(games)
            .set({
                board: updatedGame.board,
                currentPlayer: updatedGame.currentPlayer,
                endState: updatedGame.endState || null
            })
            .where(eq(games.id, gameId));
        
        return updatedGame;
    }
}