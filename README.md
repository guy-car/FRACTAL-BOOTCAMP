Build Tic Tac Toe

Game Logic
once a cell is filled it can't be changed
each click of a cell re-renders the game and calculates game state


Frontend
3x3 square
each cell is either x or o or undefined
game ends when either 3 x or o line up

____
Create game lobby page

Need to:
- ~understand why we're using client Api~
- Create a GameLobby.tsx component
- Create a GameView.tsx component
- create logic to get all games from DB

_____
New Features June 6

Matrix Tic-Tac-Toe Feature List (3.5 hrs)

Matrix Pills (30 min)

Replace 'x'/'o' text with red pill 🔴 and blue pill 🔵 emojis or custom styling
Update current player display to show pill colors
Keep game logic unchanged, just visual representation


Database Timestamps + Filter (45 min)

Add created_at timestamp column to games table (migration)
Update createGame() to set timestamp
Modify getGames() to ORDER BY created_at DESC LIMIT 10
Update lobby to show only recent games


Winner Animations/Backgrounds (45 min)

Find Matrix-themed victory gifs (Neo wins, Agent Smith wins, tie scene)
Either: CSS class swap on game end OR navigate to /game/:id/victory route
Show different scenes based on who won (X/O/tie)


Active Games Detection (1+ hr)

Track which games have active Socket.io connections
Display "👥 Players online" indicator in lobby
Help players find games with opponents ready to play




