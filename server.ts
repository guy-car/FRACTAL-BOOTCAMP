import express from "express";
import ViteExpress from "vite-express";
// import { InMemoryTicTacToeApi } from './src/api'
import { DbTicTacToeApi } from './src/db/dbapi.js'

// const api = new InMemoryTicTacToeApi
const api = new DbTicTacToeApi()

const app = express();
app.use(express.json())

app.post('/api/create', async (req, res) => {
    const game = await api.createGame()
    res.json(game)
})

app.get('/api/game/:gameId', async (req, res) => {
    const game = await api.getGame(req.params.gameId)
    res.json(game)
})

app.post('/api/game/:gameId/move', async (req, res) => {
    const game = await api.makeMove(req.params.gameId, req.body.cellIndex)
    res.json(game)
})

app.get('/api/games', async (req, res) => {
    const games = await api.getGames()
    res.json(games)
})

ViteExpress.listen(app, 3000, () => console.log(`Server is listening...`));