var canvas = document.querySelector("canvas");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    context.clearRect(blockX, blockY, 50, 50);
    blockX += block_dx;
    let borderRight = canvas.width - 50;
    if (blockX >= borderRight) {
        blockX = borderRight;
    }
    context.drawImage(playerImgRight, blockX, blockY, 50, 50);
}

function moveBlockLeft() {
    context.clearRect(blockX, blockY, 50, 50);
    blockX -= block_dx;
    if (blockX <= 0) {
        blockX = 0;
    }
    context.drawImage(playerImgLeft, blockX, blockY, 50, 50);
}

function moveBlockUp() {
    context.clearRect(blockX, blockY, 50, 50);
    blockY -= block_dy;
    if (blockY <= 0) {
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveBlockDown() {
    context.clearRect(blockX, blockY, 50, 50);
    blockY += block_dy;
    let borderDown = canvas.height - 100;
    if (blockY >= borderDown) {
        blockY = borderDown;
    }
    context.drawImage(playerImgDown, blockX, blockY, 50, 50);
}

function moveDioganalyRightUp() {
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
    context.clearRect(blockX, blockY, 50, 50);
    blockY += block_dy;
    blockX += block_dx;
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

function moveDioganalyLeftDown() {
    context.clearRect(blockX, blockY, 50, 50);
    blockY += block_dy;
    blockX -= block_dx;
    context.drawImage(playerImg, blockX, blockY, 50, 50);
}

let bulletSize = 30;
let bulletSpeed = 20;
let bullets = [];

function createBullet(x, y, direction) {
    bullets.push({ x: x, y: y, direction: direction});
}

function refreshBullets() {
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];

        if (bullet.direction === "up") {
            bullet.y -= bulletSpeed;
        } else if (bullet.direction === "down") {
            bullet.y += bulletSpeed;
        } else if (bullet.direction === "left") {
            bullet.x -= bulletSpeed;
        } else if (bullet.direction === "right") {
            bullet.x += bulletSpeed;
        }

        /*for (var j = 0; j < viholliset.length; j++) {
            var vihollinen = viholliset[j];
            if (tarkistaTörmäys(ammus, vihollinen)) {
                viholliset.splice(j, 1);
                ammukset.splice(i, 1);
                i--;
                break;
            }
        }*/

        if (bullet.x < 0 || 
            bullet.x > canvas.width || 
            bullet.y < 0 || 
            bullet.y > canvas.height
        ) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function drawBullets() {
    context.fillStyle = "red";
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        context.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }
};


let dx=3;
let dy=3;
let enemyInfoList=[
    {x:0, y:window.innerHeight / 2 - 50},
    {x:window.innerWidth-50, y:window.innerHeight / 2 - 50},
    {x:window.innerWidth / 2, y:innerHeight - 100},
    {x:window.innerWidth / 2, y:0}
]
let enemyBtm=new Image;
enemyBtm.src="enemyImgs/enemyBtm.png";
function createEnemies() {
    spawnSide = Math.floor(Math.random() * 4) + 1;
    switch (spawnSide) {
        case 1: // left side spawn
            context.clearRect(enemyInfoList[0].x, enemyInfoList[0].y, 50, 100);
            enemyInfoList[0].x+=dx;
            context.fillRect(enemyInfoList[0].x, enemyInfoList[0].y, 50, 100);
            break;
        case 2: // right side spawn
            context.clearRect(enemyInfoList[1].x, enemyInfoList[1].y, 50, 100);
            enemyInfoList[1].x-=dx;
            context.fillRect(enemyInfoList[1].x, enemyInfoList[1].y, 50, 100);
            break;
        case 3: // bottom spawn
            context.clearRect(enemyInfoList[2].x, enemyInfoList[2].y, 50, 100);
            enemyInfoList[2].y-=dy;
            //context.fillRect(enemyInfoList[2].x, enemyInfoList[2].y, 50, 100);
            context.drawImage(enemyBtm, enemyInfoList[2].x, enemyInfoList[2].y);
            break;
        case 4: // top spawn
            context.clearRect(enemyInfoList[3].x, enemyInfoList[3].y, 50, 100);
            enemyInfoList[3].y+=dy;
            context.fillRect(enemyInfoList[3].x, enemyInfoList[3].y, 50, 100);
            break;
    }
    requestAnimationFrame(createEnemies);
    if(enemyInfoList[0].x>=window.innerHeight){
        enemyInfoList[0].x=0;
    }
    if(enemyInfoList[1].x<=0){
        enemyInfoList[1].x=window.innerHeight / 2 - 50;
    }
    if(enemyInfoList[2].y<=0){
        enemyInfoList[2].y=window.innerHeight - 100;
    }
    if(enemyInfoList[3].y>=window.innerHeight-100){
        enemyInfoList[3].y=0;
    }
};
createEnemies();

document.addEventListener("keydown", function (keyInput) {
    switch (keyInput.code) {
        case 'KeyD':
            moveBlockRight();
            break;
        case 'KeyA':
            moveBlockLeft();
            break;
        case 'KeyW':
            moveBlockUp();
            break;
        case 'KeyS':
            moveBlockDown();
            break;
        case "ArrowUp":
            createBullet(blockX + 50 / 2 - bulletSize / 2, blockY,"up");
            break;
        case "ArrowDown":
            createBullet(
                blockX + 50 / 2 - bulletSize / 2,
                blockY + 50,
                "down"
                );
            break;
        case "ArrowLeft":
            createBullet(
                blockX, 
                blockY + 50 / 2 - bulletSize / 2,
                "left"
            );
            break;
        case "ArrowRight":
            createBullet(
                blockX + 50,
                blockY + 50 / 2 - bulletSize / 2,
                "right"
            );
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
