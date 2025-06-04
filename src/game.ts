export type Player = 'o' | 'x'
export type Cell = Player | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type CellIndex = number
export type EndState = 'x' | 'o' | 'tie' | undefined

export type Game = {
    id: string,
    board: Board,
    currentPlayer: Player,
    endState?: EndState
}

export const initialGameState = (): Omit<Game, 'id'> => {
    return {
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: 'x'
    }
}

export function isValidMove(game: Game, index: number): boolean {
    return game.board[index] === null
}

export function makeMove(game: Game, index: number): Game {
    const newGame = structuredClone(game)
    newGame.board[index] = newGame.currentPlayer
    return newGame
}

export function findWinningCells(game: Game): number[] | null {
    return winningStates.find((winState) => 
        winState.every((cellIndex) => 
            game.board[cellIndex] === game.currentPlayer)) || null
}

export function switchPlayer(currentPlayer: Player):Player {
    return currentPlayer === 'x' ? 'o' : 'x'
}

export function checkEndState(game: Game): EndState {
    if (findWinningCells(game)) 
        return game.currentPlayer

    if (game.board.every(cell => cell !== null))
        return 'tie'

    else return undefined
}

const winningStates = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal from top-left to bottom-right
    [2, 4, 6]  // diagonal from top-right to bottom-left
]