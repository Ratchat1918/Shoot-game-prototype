var canvas = document.querySelector("canvas");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas.width, canvas.height);

let blockX = window.innerWidth / 2 - 25;
let blockY = window.innerHeight / 2 - 25;
let block_dx = 10;
let block_dy = 10;

console.log(`Pelaajan sijaitsi X:${blockX}, Y:${blockY}`);

let playerImg = new Image();
playerImg.src = "playerImgs/Player.png";
let playerImgDown = new Image();
playerImgDown.src = "playerImgs/PlayerDown.png";
let playerImgLeft = new Image();
playerImgLeft.src = "playerImgs/PlayerLeft.png";
let playerImgRight = new Image();
playerImgRight.src = "playerImgs/PlayerRight.png";

playerImg.onload = function() {
    context.drawImage(playerImg, blockX, blockY, 50, 50);
};

function moveBlockRight() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockX += block_dx;
    let borderRight = canvas.width - 50;
    if (blockX >= borderRight) {
        blockX = borderRight;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveBlockLeft() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockX -= block_dx;
    if (blockX <= 0) {
        blockX = 0;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveBlockUp() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockY -= block_dy;
    if (blockY <= 0) {
        blockY = 0;
    }
    context.fillRect(blockX, blockY, 50,50);
};
function moveBlockDown(){
    console.log(blockX,blockY);
    context.clearRect(blockX,blockY,50,50);
    blockY+=block_dy;
    let borderDown=canvas.heght-100;
    if(blockY>=borderDown){
        blockY=borderDown;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveDioganalyRightUp() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockX += block_dx;
    blockY -= block_dy;
    let borderRight = canvas.width - 50;
    if (blockY <= 0 && blockX >= borderRight) {
        blockX = borderRight;
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveDioganalyLeftUp() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockY -= block_dy;
    blockX -= block_dx;
    if (blockY <= 0 && blockX <= 0) {
        blockX = 0;
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveDioganalyRightDown() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockY += block_dy;
    blockX += block_dx;
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveDioganalyLeftDown() {
    console.log(blockX, blockY);
    context.clearRect(blockX, blockY, 50, 50);
    blockY += block_dy;
    blockX -= block_dx;
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

let bulletX = blockX + 60;
let bulletY = blockY + 25;

function shootBullet(){

};


function createEnemies(){
    console.log('testi');
    spawnSide=Math.floor(Math.random() * 4) + 1;
    console.log(spawnSide);
    switch (spawnSide) {
        case 1: // left side spawn
            let enemyLeftX = 0;
            let enemyLeftY = window.innerHeight / 2 - 50;
            context.fillRect(enemyLeftX, enemyLeftY, 50, 100);
            for (let x = 0; x < window.innerWidth; x + 10) {
                context.clearRect(enemyLeftX, enemyLeftY, 50, 100);
                enemyLeftX += 10;
                context.fillRect(enemyLeftX, enemyLeftY, 50, 100);
            }
            break;
        case 2: // right side spawn
            context.fillRect(window.innerWidth - 50, window.innerHeight / 2 - 50, 50, 100);
            break;
        case 3: // bottom spawn
            context.fillRect(window.innerWidth / 2, innerHeight - 100, 50, 100);
            break;
        case 4: // top spawn
            context.fillRect(window.innerWidth / 2, 0, 50, 100);
            break;
    }
};

document.addEventListener("keydown", function (keyInput) {
    switch (keyInput.code) {
        case 'KeyD':
            bulletX = blockX + 60;
            bulletY = blockY + 25;
            moveBlockRight();
            break;
        case 'KeyA':
            bulletX = blockX + 60;
            bulletY = blockY + 25;
            moveBlockLeft();
            break;
        case 'KeyW':
            bulletX = blockX + 60;
            bulletY = blockY + 25;
            moveBlockUp();
            break;
        case 'KeyS':
            bulletX = blockX + 60;
            bulletY = blockY + 25;
            moveBlockDown();
            break;
        case "KeyY":
            shootBullet();
            break;
        case "KeyO":
            createEnemies();
            break;
    }
});

// Liikuuminen dioganalilla
let keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (keysPressed['w'] && event.key == 'a' || keysPressed['a'] && event.key == 'w') {
        moveDioganalyLeftUp();
    } else if (keysPressed['w'] && event.key == 'd' || keysPressed['d'] && event.key == 'w') {
        moveDioganalyRightUp();
    } else if (keysPressed['s'] && event.key == 'a' || keysPressed['a'] && event.key == 's') {
        moveDioganalyLeftDown()
    } else if (keysPressed['s'] && event.key == 'd' || keysPressed['d'] && event.key == 's') {
        moveDioganalyRightDown();
    }
});
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

