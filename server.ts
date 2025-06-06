import express from "express";
import cors from "cors"
// import { InMemoryTicTacToeApi } from './src/api'
import { DbTicTacToeApi } from './src/db/dbapi'
import { Server } from "socket.io"
import { GAME_UPDATED, USER_JOINED } from "./constants";
import { type Game } from './src/game'

const app = express();
app.use(express.json())

app.use(cors())
// const api = new InMemoryTicTacToeApi
const api = new DbTicTacToeApi()

app.post('/api/create', async (req, res) => {
    const game = await api.createGame()
    res.json(game)
})

app.get('/api/game/:gameId', async (req, res) => {
    const game = await api.getGame(req.params.gameId)
    res.json(game)
})

const makeRoomId = (game: Game) => `game-${game.id}`;

app.post('/api/game/:gameId/move', async (req, res) => {
    const game = await api.makeMove(req.params.gameId, req.body.cellIndex)
    io.to(makeRoomId(game)).emit(GAME_UPDATED, game)
    res.json(game)
})

app.get('/api/games', async (req, res) => {
    const games = await api.getGames()
    res.json(games)
})

const PORT = parseInt(process.env.PORT || "3000");

const server = app.listen(PORT,
    () => console.log(`Server is listening at http://localhost:${PORT}`));

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`a user connected: ${socket.id}`);
    
    socket.on("join-game", async (gameId: string) => {
        const game = await api.getGame(gameId);
        if (!game) {
            console.error(`Game ${gameId} not found`);
            return;
        }
        const roomId = makeRoomId(game);
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        io.to(roomId).emit(USER_JOINED, socket.id);
    });
});