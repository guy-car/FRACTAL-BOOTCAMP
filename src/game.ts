export type Player = 'o' | 'x'
export type Cell = Player | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type CellIndex = number
export type EndState = 'x' | 'o' | 'tie' | undefined

export type Game = {
    board: Board,
    currentPlayer: Player,
    endState?: EndState
}

export const initialGameState = (): Game => {
    return {
        board: [null, null, null, null, null, null, null, null, null],
        currentPlayer: 'x'
    }
}

