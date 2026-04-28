let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;



const main = document.querySelector('main');

// Player = 'P', Wall = '*', Enemy = 'E', Point = '.'
let maze = [
    ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
    ['*', 'P', '.', '*', '.', '.', '.', '.', 'E', '*'],
    ['*', '.', '.', '.', '.', '.', '.', '*', '*', '*'],
    ['*', '.', '.', '.', '.', '.', '.', '.', '.', '*'],
    ['*', '.', '*', '*', '.', '.', '.', '.', '.', '*'],
    ['*', '.', '.', '.', '.', '.', '.', '*', '*', '*'],
    ['*', '.', '.', '*', '.', 'E', '.', '.', '.', '*'],
    ['*', '.', '.', '.', '.', '.', '.', '*', '.', '*'],
    ['*', 'E', '*', '.', '.', '.', '.', '.', '.', '*'],
    ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*']
];

// Populates the maze
maze.forEach((y) => {
    y.forEach((x) => {
        let block = document.createElement('div')
        block.classList = 'block'

        switch (x) {
            case '*':
                block.classList.add('wall')
                break;
            case 'P':
                block.id = 'player';
                break;
            case 'E':
                block.classList.add('enemy');
                break
            default:
                block.classList.add('point')
        }
        main.appendChild(block)
    })
})

// Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

const player = document.querySelector('#player');
let playerTop = 0;
let playerLeft = 0;

function move() {
    if (downPressed) {
        playerTop++;
        player.style.top = playerTop + 'px';
        player.classList = 'down';
    }
    else if (upPressed) {
        playerTop--;
        player.style.top = playerTop + 'px';
        player.classList = 'up';
    }
    else if (leftPressed) {
        playerLeft--;
        player.style.left = playerLeft + 'px';
        player.classList = 'left';
    }
    else if (rightPressed) {
        playerLeft++;
        player.style.left = playerLeft + 'px';
        player.classList = 'right';
    }
    requestAnimationFrame(move);
}

move();
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


const h1 = document.querySelector('#start')
function removingStartButton() {
    h1.innerHTML = 'changed!'
}

history.addEventListener('click', removingStartButton)

