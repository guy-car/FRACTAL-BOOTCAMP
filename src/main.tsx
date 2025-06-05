import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ClientTicTacToeApi } from './api.ts'
import GameLobby from  './components/GameLobby.tsx'
import GameView from  './components/GameView.tsx'


const api = new (ClientTicTacToeApi)

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: GameLobby,
        loader: async () => {
          const games = await api.getGames()
          return { games }
        },
      },
      {
        path: "/game/:gameId",
        Component: GameView,
        loader: async ({ params }) => {
          if(!params.gameId) {
            throw new Error("Games ID is required!")
          }
          const game = await api.getGame(params.gameId)
          return { game }
        }
      }
    ]

  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
