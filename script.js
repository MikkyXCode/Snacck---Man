// initialising variables gthat will be used later in the code. 
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// separate flags for GUI buttons, independent of keyboard
let btnUp = false;
let btnDown = false;
let btnLeft = false;
let btnRight = false;

let gameStarted = false;
let gameOver = false;
let score = 0;
let lives = 3;
let isAnimating = false;
let hitCooldown = false;
let scaredTimeout = null;

const main = document.querySelector('main');
const scoreDisplay = document.querySelector('.score p');
const livesListEl = document.getElementById('livesList');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreEl = document.getElementById('finalScore');
const leaderboardList = document.getElementById('leaderboardList');
const enemyDirections = new WeakMap();



let currentLevel = 0;
let enemySpeed = 800; // will decrease each level, making them faster 

const mazes = [
    // Level 1 
    [
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        ['*', 'P', '.', '*', '*', '*', '*', '.', '.', '*'],
        ['*', '.', '.', '.', '*', '*', '.', '.', '.', '*'],
        ['*', '.', '.', '.', '.', '.', '.', '.', '.', '*'],
        ['*', 'O', '*', '*', '.', '.', '*', '*', 'O', '*'],
        ['*', '.', '.', '.', '.', '.', '.', '.', '.', '*'],
        ['*', '*', '*', '.', '.', '.', '.', '*', '*', '*'],
        ['*', '.', '.', '.', '*', '*', '.', '.', '.', '*'],
        ['*', 'O', '.', '.', '*', '*', '.', '.', 'O', '*'],
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
    ],
    // Level 2 - harder layout
    [
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        ['*', 'P', '.', '.', '.', '*', 'O', '.', '.', '*'],
        ['*', '*', '*', '.', '*', '*', '.', '*', 'O', '*'],
        ['*', 'O', '.', '.', '.', '.', '.', '*', '.', '*'],
        ['*', '.', '*', '*', '*', '.', '*', '*', '.', '*'],
        ['*', '.', '.', '.', '.', '.', '.', '.', '.', '*'],
        ['*', '*', '.', '*', '*', '*', '.', '*', '*', '*'],
        ['*', '.', '.', '.', '.', '.', '.', 'O', '.', '*'],
        ['*', 'O', '*', '*', '.', '*', '*', '.', '.', '*'],
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
    ],
    // Level 3 - harder than level 2 
    [
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
        ['*', 'P', '.', '.', '.', '.', '.', '.', 'O', '*'],
        ['*', '.', '*', '*', '*', '.', '*', '*', '.', '*'],
        ['*', '.', '*', '.', '.', 'O', '.', '*', '.', '*'],
        ['*', '.', '.', '.', '*', '*', '.', '.', '.', '*'],
        ['*', '*', '*', '.', '*', '*', '.', '*', '*', '*'],
        ['*', '.', '.', '.', '.', '.', '.', '.', '.', '*'],
        ['*', '.', '*', '*', '*', '*', '*', '*', '.', '*'],
        ['*', 'O', '.', '.', '.', '.', '.', '.', '.', '*'],
        ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
    ]
];

// ----- Function build lives in the game, rebuilds them when game resets --------
function buildLives() {
    livesListEl.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        let li = document.createElement('li');
        livesListEl.appendChild(li);
    }
}

buildLives();

// function that checks earch character in the maze array and uses it to build the players maze 
function buildMaze() {
    main.innerHTML = '';
    let currentMaze = mazes[currentLevel] || mazes[mazes.length - 1];
    currentMaze.forEach((y) => {
        y.forEach((x) => {
            let block = document.createElement('div');
            block.classList = 'block';
            switch (x) {
                case '*':
                    block.classList.add('wall');
                    break;
                case 'P':
                    block.id = 'player';
                    break;
                case 'O':
                    block.classList.add('pellet');
                    block.dataset.hasPoint = 'true'; //  pellets should also be restored
                    break;
                default:
                    block.classList.add('point');
                    block.dataset.hasPoint = 'true'; // clearly inside default now
                    break;
            }
            main.appendChild(block);
        });
    });
}

buildMaze();

//this function selects random valid cells (not wall or players ) to place enemies 
function spawnEnemies(count = 3) {
    let blocks = Array.from(main.children);
    let validBlocks = blocks.filter(block =>
        !block.classList.contains('wall') &&
        block.id !== 'player'
    );
    for (let i = validBlocks.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [validBlocks[i], validBlocks[j]] = [validBlocks[j], validBlocks[i]];
    }
    validBlocks.slice(0, count).forEach(block => {
        block.classList.remove('point');
        block.classList.add('enemy');
    });
}

spawnEnemies(3);

// player 
let player = document.querySelector('#player');
let playerTop = 0;
let playerLeft = 0;

// checks if a key is pressed on the keyboard.
function keyUp(event) {
    if (event.key === 'ArrowUp') upPressed = false;
    if (event.key === 'ArrowDown') downPressed = false;
    if (event.key === 'ArrowLeft') leftPressed = false;
    if (event.key === 'ArrowRight') rightPressed = false;
}

function keyDown(event) {
    if (!gameStarted || gameOver) return;
    if (event.key === 'ArrowUp') upPressed = true;
    if (event.key === 'ArrowDown') downPressed = true;
    if (event.key === 'ArrowLeft') leftPressed = true;
    if (event.key === 'ArrowRight') rightPressed = true;
}

/*  GUI ARROW BUTTONS
 Click once to start moving that way, click again to stop
Completely independent of keyboard  */

function setButtonDir(dir) {
    // toggle off if same button clicked again
    let alreadyActive =
        (dir === 'up' && btnUp) ||
        (dir === 'down' && btnDown) ||
        (dir === 'left' && btnLeft) ||
        (dir === 'right' && btnRight);

    btnUp = btnDown = btnLeft = btnRight = false; // clear all

    if (!alreadyActive) { // only set if it wasn't already active
        if (dir === 'up') btnUp = true;
        if (dir === 'down') btnDown = true;
        if (dir === 'left') btnLeft = true;
        if (dir === 'right') btnRight = true;
    }
}

document.getElementById('ubttn').addEventListener('click', () => { if (gameStarted && !gameOver) setButtonDir('up'); });
document.getElementById('dbttn').addEventListener('click', () => { if (gameStarted && !gameOver) setButtonDir('down'); });
document.getElementById('lbttn').addEventListener('click', () => { if (gameStarted && !gameOver) setButtonDir('left'); });
document.getElementById('rbttn').addEventListener('click', () => { if (gameStarted && !gameOver) setButtonDir('right'); });


// this is the main game loop, it runs every frame via request animation frame, for each frame it checks which direction the player wants to move, calls canMove() to check walls ahead, it cheaks for point and enemy collision, updates player position, etc. 
function move() {
    if (gameOver || isAnimating) return;

    let position = player.getBoundingClientRect();

    // combine keyboard and button directions, keyboard takes priority
    let goDown = downPressed || btnDown;
    let goUp = upPressed || btnUp;
    let goLeft = leftPressed || btnLeft;
    let goRight = rightPressed || btnRight;

    if (goDown) {
        if (canMove(position, 'down')) { playerTop++; player.style.top = playerTop + 'px'; }
        player.className = 'down';
    } else if (goUp) {
        if (canMove(position, 'up')) { playerTop--; player.style.top = playerTop + 'px'; }
        player.className = 'up';
    } else if (goLeft) {
        if (canMove(position, 'left')) { playerLeft--; player.style.left = playerLeft + 'px'; }
        player.className = 'left';
    } else if (goRight) {
        if (canMove(position, 'right')) { playerLeft++; player.style.left = playerLeft + 'px'; }
        player.className = 'right';
    }

    if (checkPointCollision()) {
        score += 10;
        scoreDisplay.textContent = score;
        checkWin();
    }

    if (checkEnemyCollision() && !hitCooldown) {
        hitCooldown = true;
        lives--;

        // remove one life element from the list
        let lifeItems = livesListEl.querySelectorAll('li');
        if (lifeItems[lives]) lifeItems[lives].style.visibility = 'hidden';

        if (lives === 0) {
            // play death animation then show game over
            player.className = 'dead';
            isAnimating = true;
            setTimeout(() => {
                isAnimating = false;
                showGameOver('Game Over!');
            }, 1500);
            return;
        }

        // hit animation — freeze player for 1.5s
        player.className = 'hit';
        isAnimating = true;
        setTimeout(() => {
            player.className = '';
            playerTop = 0;
            playerLeft = 0;
            player.style.top = '0px';
            player.style.left = '0px';
            isAnimating = false;
            hitCooldown = false;
            requestAnimationFrame(move);
        }, 1500);
        return;
    }

    requestAnimationFrame(move);
}

// this checks what is ahead and the player and if there are walls present then the player movement is blocked - it cann'tMove
function canMove(position, direction) {
    let point1, point2;
    switch (direction) {
        case 'down':
            point1 = document.elementFromPoint(position.left + 2, position.bottom + 1);
            point2 = document.elementFromPoint(position.right - 2, position.bottom + 1);
            break;
        case 'up':
            point1 = document.elementFromPoint(position.left + 2, position.top - 1);
            point2 = document.elementFromPoint(position.right - 2, position.top - 1);
            break;
        case 'left':
            point1 = document.elementFromPoint(position.left - 1, position.top + 2);
            point2 = document.elementFromPoint(position.left - 1, position.bottom - 2);
            break;
        case 'right':
            point1 = document.elementFromPoint(position.right + 1, position.top + 2);
            point2 = document.elementFromPoint(position.right + 1, position.bottom - 2);
            break;
    }
    if (!point1 || !point2) return false;
    return !point1.classList.contains('wall') && !point2.classList.contains('wall');
}

//this function loops through every enemy and checks if they collid with the player,and  if the enemy is scred from the power pallet, the enemy gets eaten for bonus points instead. 
function checkEnemyCollision() {
    let position = player.getBoundingClientRect();
    for (let enemy of document.querySelectorAll('.enemy')) {
        let ep = enemy.getBoundingClientRect();
        if (position.left < ep.right && position.right > ep.left &&
            position.top < ep.bottom && position.bottom > ep.top) {

            if (enemy.classList.contains('scared')) {
                // eat the scared ghost
                enemy.classList.remove('enemy', 'scared');
                enemy.classList.add('point');
                score += 200;
                scoreDisplay.textContent = score;
                return false; // no life lost
            }
            return true; // normal collision
        }
    }
    return false;
}

//function cheacks if player collids with the dots and pallets and increases the score if they do 
function checkPointCollision() {
    let position = player.getBoundingClientRect();
    let points = document.querySelectorAll('.point, .pellet');
    let eaten = false;

    for (let i = 0; i < points.length; i++) {
        let pos = points[i].getBoundingClientRect();
        if (position.right > pos.left && position.left < pos.right &&
            position.bottom > pos.top && position.top < pos.bottom) {

            if (points[i].classList.contains('pellet')) {
                points[i].classList.remove('pellet');
                points[i].dataset.hasPoint = 'false'; //  mark as eaten
                activateScaredMode();
                score += 50;
                scoreDisplay.textContent = score;
            } else {
                points[i].classList.remove('point');
                points[i].dataset.hasPoint = 'false'; //  mark as eaten
            }
            eaten = true;
        }
    }
    return eaten;
}

function activateScaredMode() {
    // make all enemies scared
    document.querySelectorAll('.enemy').forEach(e => e.classList.add('scared'));

    // clear any existing scared timer
    if (scaredTimeout) clearTimeout(scaredTimeout);

    // scared mode lasts 5 seconds
    scaredTimeout = setTimeout(() => {
        document.querySelectorAll('.enemy').forEach(e => e.classList.remove('scared'));
    }, 5000);
}

// this function counts the remaining dots left in the maze, if it is zero it loads the next level and then increases the enemy speed 
function checkWin() {
    if (document.querySelectorAll('.point, .pallet').length === 0) {
        currentLevel++;

        if (currentLevel >= mazes.length) {
            // completed all levels
            showGameOver('You Win! ');
            return;
        }

        //  speed up enemies each level
        enemySpeed = Math.max(80, enemySpeed - 40);

        // show level banner briefly then load next maze
        gameOverMessage.textContent = 'Level ' + (currentLevel + 1) + '!';
        finalScoreEl.textContent = 'Score: ' + score;
        gameOverScreen.style.display = 'flex';
        document.getElementById('saveScoreBtn').style.display = 'none';
        document.getElementById('nameInput').style.display = 'none';

        setTimeout(() => {
            gameOverScreen.style.display = 'none';
            document.getElementById('saveScoreBtn').style.display = '';
            document.getElementById('nameInput').style.display = '';

            clearTimeout(enemyTimeout);
            playerTop = 0;
            playerLeft = 0;

            buildMaze();
            spawnEnemies(3);

            player = document.querySelector('#player');
            player.style.top = '0px';
            player.style.left = '0px';

            moveEnemies();
        }, 2000);
    }
}

//sets gameover to true which stops the game loop and enemy movement, it then displays the game over screen with the final score
function showGameOver(message) {
    gameOver = true;
    gameOverMessage.textContent = message;
    finalScoreEl.textContent = 'Score: ' + score;
    gameOverScreen.style.display = 'flex';
}

// this function reads existing scores array from local storage, sorts the scores from highest to lowest and then trims it to the top 10
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('snackmanScores') || '[]');
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score); // highest first
    scores = scores.slice(0, 10); // keep top 10
    localStorage.setItem('snackmanScores', JSON.stringify(scores));
}

// they read the list of scores, and apply a gold color to the first entry (highest score)
function loadLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('snackmanScores') || '[]');
    leaderboardList.innerHTML = scores.length === 0
        ? '<li style="font-size:0.85em; padding:1em 0;">No scores yet</li>'
        : scores.map(e => `<li>${e.name} ........ ${e.score}</li>`).join('');
}

loadLeaderboard();

// this section of code, allows player to enter their name and saves their score in local storage once player clicks save score button (it doesnt let player save their score if they dont input thier name)
document.getElementById('saveScoreBtn').addEventListener('click', () => {
    let name = document.getElementById('nameInput').value.trim();
    if (!name) { alert('Please enter your name!'); return; }
    saveScore(name, score);
    loadLeaderboard();
    document.getElementById('nameInput').value = '';
    document.getElementById('saveScoreBtn').style.display = 'none';
    document.getElementById('nameInput').style.display = 'none';
});

// restarts every variable to its starting value

function resetGame() {
    score = 0;
    lives = 3;
    currentLevel = 0;
    enemySpeed = 600;
    gameOver = false;
    gameStarted = false;
    isAnimating = false;
    hitCooldown = false;
    playerTop = 0;
    playerLeft = 0;
    btnUp = btnDown = btnLeft = btnRight = false;
    upPressed = downPressed = leftPressed = rightPressed = false;

    scoreDisplay.textContent = 0;
    gameOverScreen.style.display = 'none';
    document.getElementById('saveScoreBtn').style.display = '';
    document.getElementById('nameInput').style.display = '';

    buildLives();
    buildMaze();
    spawnEnemies(3);

    player = document.querySelector('#player');
    player.style.top = '0px';
    player.style.left = '0px';

    const startScreen = document.querySelector('.start');
    startScreen.style.display = 'flex';
}

document.getElementById('resetBtn').addEventListener('click', resetGame);


/* this function reads its current direction from dataset.dir thenries to move in that direction
If blocked, tries the other three directions in random order, when a valid move is found then it swaps all its classes and data sets between the current location and target location making it look like the enemy is moving
After the swap, checks if the old cell should have a dot/pellet restored using the hasPoint and pointType data attributes */
let enemyTimeout;
function moveEnemies() {
    if (gameOver || !gameStarted) return;

    const directions = ['up', 'down', 'left', 'right'];
    const cells = Array.from(main.children);
    const gridSize = 10;

    document.querySelectorAll('.enemy').forEach(enemy => {
        let currentIndex = cells.indexOf(enemy);
        let enemyRow = Math.floor(currentIndex / gridSize);
        let enemyCol = currentIndex % gridSize;

        let currentDir = enemy.dataset.dir;
        if (!currentDir) {
            currentDir = directions[Math.floor(Math.random() * directions.length)];
        }

        let otherDirs = directions.filter(d => d !== currentDir).sort(() => Math.random() - 0.5);
        let allDirs = [currentDir, ...otherDirs];

        for (let candidate of allDirs) {
            let targetIndex, targetRow, targetCol;
            switch (candidate) {
                case 'up': targetIndex = currentIndex - gridSize; targetRow = enemyRow - 1; targetCol = enemyCol; break;
                case 'down': targetIndex = currentIndex + gridSize; targetRow = enemyRow + 1; targetCol = enemyCol; break;
                case 'left': targetIndex = currentIndex - 1; targetRow = enemyRow; targetCol = enemyCol - 1; break;
                case 'right': targetIndex = currentIndex + 1; targetRow = enemyRow; targetCol = enemyCol + 1; break;
            }

            if (targetRow <= 0 || targetRow >= gridSize - 1) continue;
            if (targetCol <= 0 || targetCol >= gridSize - 1) continue;
            if (targetIndex < 0 || targetIndex >= cells.length) continue;

            let targetCell = cells[targetIndex];
            if (targetCell.classList.contains('wall')) continue;
            if (targetCell.classList.contains('enemy')) continue;
            if (targetCell.id === 'player') continue;

            // save target cell's point data before swapping
            let targetClasses = targetCell.className;
            let targetHasPoint = targetCell.dataset.hasPoint; //  remember if target had a point

            // move enemy to target cell
            targetCell.className = enemy.className;
            targetCell.dataset.dir = candidate;
            targetCell.dataset.hasPoint = enemy.dataset.hasPoint; // carry point data forward

            // restore old cell
            enemy.className = targetClasses || '';
            enemy.dataset.hasPoint = targetHasPoint; // old cell gets target's point data back
            delete enemy.dataset.dir;

            //  only restore dot if cell originally had one and hasn't been eaten
            if (enemy.dataset.hasPoint === 'true' &&
                !enemy.classList.contains('wall') &&
                !enemy.classList.contains('enemy') &&
                !enemy.classList.contains('point') &&
                enemy.id !== 'player') {
                enemy.classList.add('point');
            }

            break;
        }
    });

    enemyTimeout = setTimeout(moveEnemies, enemySpeed);
}










// waits foe the player to click the start screen, hides it, sets game started to true, it then registers keyboard listenners and calls moveand move enemies to start the game
const startScreen = document.querySelector('.start');
startScreen.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameStarted = true;
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    move();
    moveEnemies();
});