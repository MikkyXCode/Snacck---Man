#  Snack-Man

A browser-based arcade game inspired by the classic Pac-Man concept, built from scratch using **HTML, CSS and JavaScript**.

The project focuses on implementing interactive gameplay, game-state management, collision detection, scoring, multiple levels, enemy behaviour and a persistent leaderboard without relying on a game engine.

##  Features

* Classic maze-based arcade gameplay
* Player movement and directional controls
* Keyboard controls
* On-screen directional controls
* Multiple playable maze levels
* Player lives system
* Score tracking
* Collectible points and power-ups
* Enemy/ghost behaviour
* Scared-enemy mechanics
* Collision detection
* Level progression
* Increasing enemy difficulty between levels
* Win and game-over states
* Player name entry
* Persistent top-10 leaderboard
* Score storage using browser `localStorage`
* Responsive game interface

##  How It Works

The game builds the maze programmatically from predefined maze layouts using JavaScript.

During gameplay, the system manages:

* Player position
* Enemy positions
* Lives
* Score
* Current level
* Collectibles
* Collisions
* Enemy states
* Level progression

When the player collects all available points in a maze, the game progresses to the next level. Enemy speed increases as the player advances, creating progressively more difficult gameplay.

The game also includes collision logic for enemies. For example, when an enemy is in a scared state, the player can collect it for additional points rather than losing a life.

##  Leaderboard

Snack-Man includes a persistent leaderboard implemented using the browser's `localStorage` API.

Players can enter their name after a game and save their score. Scores are sorted from highest to lowest and the system retains the **top 10 scores**.

This demonstrates client-side data persistence without requiring a backend database.

##  Technologies

* **HTML5** — page structure and game interface
* **CSS3** — layout, styling and responsive presentation
* **JavaScript** — gameplay logic, game state, movement, collision detection, scoring and leaderboard functionality
* **Web Storage API** — persistent local leaderboard data
* **Git/GitHub** — source control and project development

##  Project Structure

```text
Snacck---Man/
│
├── images/
│   └── game assets
│
├── index.html
├── script.js
└── style.css
```

##  Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/MikkyXCode/Snacck---Man.git
```

### 2. Open the project

Open `index.html` in a modern web browser.

No backend server or additional dependencies are required.

##  What I Learned

This project strengthened my practical JavaScript and front-end development skills, particularly:

* Managing complex application state
* Implementing game logic
* Working with arrays and structured data
* DOM manipulation
* Event handling
* Collision detection
* Progressive difficulty
* Client-side persistence
* Building interactive browser applications
* Debugging and iteratively developing a larger JavaScript codebase

##  Links

**GitHub:**
https://github.com/MikkyXCode/Snacck---Man

##  Author

**Ayomikun Oduwole**

AI & Data Science Student
Interested in AI, Data Science, Software Engineering and Technology.
