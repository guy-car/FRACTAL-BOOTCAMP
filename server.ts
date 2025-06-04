import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeMove, checkEndState, switchPlayer } from './src/game.ts'

const games = new Map()

const app = express();
app.use(express.json())

app.get("/message", (_, res) => res.send("Hello from express!"));

app.post('/games', (req, res) => {
    const gameId = 1
    const game = initialGameState()
    games.set(gameId, game)
    res.json({ gameId, game })
})

console.log('games is: ', games)

app.post('/games/:gameId/moves', (req, res) => {
    const gameId = parseInt(req.params.gameId)
    const cellIndex = req.body.cellIndex
    const game = games.get(gameId)

    if (!game) {
        return res.status(404).json({ error: 'Game not found'})
    }

    console.log('Found game:', game)
    // update the game
    const updatedGame = makeMove(game, cellIndex)
    const endState = checkEndState(updatedGame)

    if (endState) {
        updatedGame.endState = endState
    } else {
        updatedGame.currentPlayer = switchPlayer(updatedGame.currentPlayer)
    }

    // save the updated game to the Map
    games.set(gameId, updatedGame)
    
    // return the updated game
    res.json({ game: updatedGame })

})

ViteExpress.listen(app, 3000, () => console.log(`Server is listening...`));