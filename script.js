var canvas = document.querySelector("canvas");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var blockX = window.innerWidth / 2 - 25;
var blockY = window.innerHeight / 2 - 25;
var block_dx = 10;
var block_dy = 10;

var holeX = canvas.width / 2 - 150;
var holeY = canvas.height / 2 - 150;
var holeXwidth = 300;
var holeYheight = 300;

var enemies = [];
var enemySize = 40;
var enemySpeed = 20;

let bulletSize = 10;
let bulletSpeed = 20;
let bullets = [];

var player = {
    x: blockX,
    y: blockY,
    width: 50,
    height: 50
};

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

function enemyHoles() {        /*LUO AUKOT JOISTA VIHOLLISET TULEE*/
    holeUp();
    holeDown();
    holeLeft();
    holeRight();
}

function holeUp() {             /*AUKKO YLÖS*/
    context.fillStyle = "red";
    context.fillRect(holeX, 0, holeXwidth, 15);
}

function holeDown() {           /*AUKKO ALAS*/
    context.fillStyle = "red";
    context.fillRect(holeX, canvas.height - 15, holeXwidth, 15);
}

function holeLeft() {           /*AUKKO VASEMALLE*/
    context.fillStyle = "red";
    context.fillRect(0, holeY, 15, holeYheight);
}

function holeRight() {          /*AUKKO OIKEALLE*/
    context.fillStyle = "red";
    context.fillRect(canvas.width - 15, holeY, 15, holeYheight);
}

function createEnemies() {          /*LUO VIHOLLISET SATTUMANVARAISESTI ERI AUKOISTA*/
    var hole = Math.floor(Math.random() * 4);
    var x, y, directionX, directionY;

    if (hole === 0) {         /* 0 = YLHÄÄLTÄ */
        x = holeX + Math.random() * holeXwidth;
        y = 0;
        directionX = (Math.random() - 0.5) * 2;
        directionY = 2;
    } else if (hole === 1) {  /* 1 = ALHAALTA */
        x = holeX + Math.random() * holeXwidth;
        y = canvas.height - enemySize;
        directionX = (Math.random() - 0.5) * 2;
        directionY = -2;
    } else if (hole === 2) {  /* 2 = VASEMMALTA */
        x = 0;
        y = holeY + Math.random() * holeYheight;
        directionX = 2;
        directionY = (Math.random() - 0.5) * 2;
    } else if (hole === 3) {  /* 3 = OIKEALTA */
        x = canvas.width - enemySize;
        y = holeY + Math.random() * holeYheight;
        directionX = -2;
        directionY = (Math.random() - 0.5) * 2;
    }
    enemies.push({x, y, directionX, directionY, enemySize});
    
}
function drawEnemies() {                /*PIIRTÄÄ VIHOLLISET*/
    context.fillStyle = "yellow";
    enemies.forEach(enemy => {
        context.fillRect(
            enemy.x - enemy.enemySize / 2,
            enemy.y - enemy.enemySize / 2,
            enemy.enemySize,
            enemy.enemySize
        );
    });
}

function checkCollision(player, enemy) {      /*TARKISTAA OSUUKO VIHOLLINEN PELAAJAAN*/
    
    return blockX < enemy.x + enemy.enemySize &&
            blockX + player.width > enemy.x &&
            blockY < enemy.y + enemy.enemySize &&
            blockY + player.height > enemy.y;
}

function moveEnemies() {                /*LIIKUTTAA VIHOLLISIA*/
    enemies.forEach((enemy, index) => {
        enemy.x += enemy.directionX * enemySpeed / 10;
        enemy.y += enemy.directionY * enemySpeed / 10;

        if (checkCollision(player, enemy)) {
            console.log("OSuma");
            gameOver();
        }

        if (enemy.x <= 0 || enemy.x + enemy.enemySize >= canvas.width) {
            enemy.directionX *= -1;         /*VIHOLLINEN KIMPOAAA SEINÄSTÄ*/
        }                                   
        if (enemy.y <= 0 || enemy.y + enemy.enemySize >= canvas.height) {
            enemy.directionY *= -1;         /*VIHOLLINEN KIMPOAAA SEINÄSTÄ*/
        }
    });
}

/*let dx=3;                 TÄMÄ ON EGOR SINUN TEKEMÄÄ, EN OLE POISTANUT MITÄÄN
let dy=3;                   KOMMENTOIN VAAN POIS KUN EN SAANUT TOIMIMAAN
let enemyInfoList=[         JA KOKEILIN TEHDÄ UUDESTAA VIHOLLISET
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
            context.fillRect(enemyInfoList[2].x, enemyInfoList[2].y, 50, 100);
            //context.drawImage(enemyBtm, enemyInfoList[2].x, enemyInfoList[2].y);
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
createEnemies();*/

function createBullet(x, y, direction) {        /*LUO AMMUKSEN*/
    bullets.push({ x: x, y: y, direction: direction});
}

function drawBullets() {                        /*PIIRTÄÄ AMMUKSEN*/
    context.fillStyle = "red";
    
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        context.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }
}

function refreshBullets() {                 /*PÄIVITTÄÄ AMMUKSEN*/
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

        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            if (checkHit(bullet, enemy)) {  /*JOS OSUMA POISTAA AMMUKSEN JA VIHOLLISEN*/
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                break;
            }
        }

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

function checkHit(bullet, enemy) {              /*TARKISTAA OSUMAN VIHOLLISEEN*/
    return (
        bullet.x < enemy.x + enemy.enemySize &&
        bullet.x + bulletSize > enemy.x &&
        bullet.y < enemy.y + enemy.enemySize &&
        bullet.y + bulletSize > enemy.y
    );
}

function gameOver() {
    console.log("Peli päättyi");
    alert("Osuma, peli päättyi");
    let restart = confirm("Haluatko pelata uudestaan?");

    if (restart) {
        resetGame();
        location.reload();
    } else {
        alert("Kiitos pelaamisesta!");
    }
    
}

function resetGame() {
    blockX = window.innerWidth / 2 -25;
    blockY = window.innerHeight / 2 -25;
    enemies = [];
    bullets = [];
    player = {
        x: blockX,
        y: blockY,
        width: 50,
        height: 50
    };
    playerImg.onload = function() {
        context.drawImage(playerImg, blockX, blockY, 50, 50);
    };

}

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
            createBullet(blockX + 50 / 2 - bulletSize / 2, 
                blockY,
                "up");
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
enemyHoles();
function refreshAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);   /*TYHJENTÄÄ KANVAKSEN*/
    moveBlockDown();
    moveBlockLeft();                           /*NÄMÄ FUNKTIOT LUO UUDELLEEN OBJEKTIT*/
    moveBlockRight();
    moveBlockUp();
    refreshBullets();
    drawBullets();
    enemyHoles();
    drawEnemies();
    moveEnemies();
    
    

    requestAnimationFrame(refreshAll);
}

refreshAll();
setInterval(createEnemies, 7000);              /*LÄHETTÄÄ VIHOLLISIA 3 SEKUNNIN VÄLEIN*/