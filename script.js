var canvas = document.getElementById("gameArea");
var context = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight;

let gameActive = true;

let isGamePaused=false;

var playerWidth = canvas.width * 0.05;
var blockX = canvas.width / 2 - playerWidth / 2;
var blockY = canvas.height / 2 - playerWidth / 2;
var block_dx = 12;
var block_dy = 12;

var holeXwidth = canvas.width * 0.2;
var holeYheight = canvas.height * 0.35;
var holeX = canvas.width / 2 - holeXwidth / 2;
var holeY = canvas.height / 2 - holeYheight / 2;
var holeDepth = holeXwidth * 0.05;

var enemies = [];
var enemySize = canvas.width * 0.02;
var enemySpeed = 20;
var enemiesSecBetw = 3000;
var countHits = 0;
var intervalId;

let bulletSize = canvas.width * 0.007;
let bulletSpeed = 20;
let bullets = [];

var shotSound=document.getElementById("myAudio");

var player = {
    x: blockX,
    y: blockY,
    width: 50,
    height: 50
};

var fontSize = Math.floor(canvas.width * 0.08);
context.font = fontSize + "px Arial";

console.log(`Pelaajan sijaitsi X:${blockX}, Y:${blockY}`);

let playerImg = new Image();
playerImg.src = "spaceship.png";

playerImg.onload = function() {
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
};

let enemyImg= new Image();
enemyImg.src="satelite32x32.png";

function moveBlockRight() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockX += block_dx;
    let borderRight = canvas.width - playerWidth;
    if (blockX >= borderRight) {
        blockX = borderRight;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveBlockLeft() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockX -= block_dx;
    if (blockX <= 0) {
        blockX = 0;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveBlockUp() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockY -= block_dy;
    if (blockY <= 0) {
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveBlockDown() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockY += block_dy;
    let borderDown = canvas.height - playerWidth/2;
    if (blockY >= borderDown) {
        blockY = borderDown;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveDioganalyRightUp() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockX += block_dx;
    blockY -= block_dy;
    let borderRight = canvas.width - playerWidth;
    if (blockY <= 0 && blockX >= borderRight) {
        blockX = borderRight;
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveDioganalyLeftUp() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockY -= block_dy;
    blockX -= block_dx;
    if (blockY <= 0 && blockX <= 0) {
        blockX = 0;
        blockY = 0;
    }
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveDioganalyRightDown() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockY += block_dy;
    blockX += block_dx;
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function moveDioganalyLeftDown() {
    context.clearRect(blockX, blockY, playerWidth, playerWidth);
    blockY += block_dy;
    blockX -= block_dx;
    context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
}

function enemyHoles() {        /*LUO AUKOT JOISTA VIHOLLISET TULEE*/
    holeUp();
    holeDown();
    holeLeft();
    holeRight();
}

function holeUp() {             /*AUKKO YLÖS*/
    context.fillStyle = "red";
    context.fillRect(holeX, 0, holeXwidth, holeDepth);
}

function holeDown() {           /*AUKKO ALAS*/
    context.fillStyle = "red";
    context.fillRect(holeX, canvas.height - holeDepth, holeXwidth, holeDepth);
}

function holeLeft() {           /*AUKKO VASEMALLE*/
    context.fillStyle = "red";
    context.fillRect(0, holeY, holeDepth, holeYheight);
}

function holeRight() {          /*AUKKO OIKEALLE*/
    context.fillStyle = "red";
    context.fillRect(canvas.width - holeDepth, holeY, holeDepth, holeYheight);
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
        context.drawImage(
            enemyImg,
            enemy.x - enemy.enemySize / 2,
            enemy.y - enemy.enemySize / 2,
            enemy.enemySize,
            enemy.enemySize
        );
    });
}

function checkCollision(player, enemy) {      /*TARKISTAA OSUUKO VIHOLLINEN PELAAJAAN*/
    return blockX < enemy.x + enemy.enemySize - 15 &&    /**VASEMMALTA? HYVÄ OSUMA */
            blockX + player.width - 5 > enemy.x &&      /**OIKEALTA? HYVÄ OSUMA */
            blockY < enemy.y + enemy.enemySize - 20 &&   /**YLHÄÄLTÄ? SLÄK */
            blockY + player.height - 5 > enemy.y;       /**ALHAALTA? HYVÄ OSUMA */
}

function moveEnemies() {                /*LIIKUTTAA VIHOLLISIA*/
    enemies.forEach((enemy, index) => {
        enemy.x += enemy.directionX * enemySpeed / 10;
        enemy.y += enemy.directionY * enemySpeed / 10;

        if (checkCollision(player, enemy)) {    /**OSUMAN TARKISTUS VIHOLLINEN <--> PELAAAJA */
            checkLives();
            if (lives > 0) {
                removeEnemy(index);
            }
        }

        if (enemy.x <= 0 || enemy.x + enemy.enemySize >= canvas.width) {
            enemy.directionX *= -1;         /*VIHOLLINEN KIMPOAAA SEINÄSTÄ*/
        }                                   
        if (enemy.y <= 0 || enemy.y + enemy.enemySize >= canvas.height) {
            enemy.directionY *= -1;         /*VIHOLLINEN KIMPOAAA SEINÄSTÄ*/
        }
    });
}

function removeEnemy(index) {
    enemies.splice(index, 1);
}

function createBullet(x, y, direction) {        /*LUO AMMUKSEN*/
    bullets.push({ x: x, y: y, direction: direction});
    shotSound.play();
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
            if (checkHit(bullet, enemy)) {  /*JOS OSUMA, POISTAA AMMUKSEN JA VIHOLLISEN*/
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                countHits += 1;
                ScoreBoardHits();
                if (countHits === 10) {     /**10 OSUMAN VÄLEIN VIHOLLISIA TULEE NOPEAMMIN */
                    if (enemiesSecBetw > 500) {
                        enemiesSecBetw -= 500;
                    }
                    countHits -= 10;
                    updateInterval();
                }
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

function gameOver() {       /**ILMOITUS PELIN PÄÄTTYMISESTÄ */
    gameActive = false;
    let overWindowWidth = canvas.width / 2;
    let overWindowHeight = canvas.height / 2;
    let overWindowX = canvas.width / 4;
    let overWindowY = canvas.height / 4;

    context.fillStyle = "rgba(255, 192, 203, 0.5)";
    context.fillRect(overWindowX, overWindowY, overWindowWidth, overWindowHeight);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "red";

    context.fillText(
        "Game over", 
        overWindowX + overWindowWidth / 2, 
        overWindowY + overWindowHeight / 2 -80);
    
    let playAgainWidth = overWindowWidth * 0.8;
    let playAgainHeight = overWindowHeight * 0.3;
    let playAgainX = overWindowX + overWindowWidth / 2 - playAgainWidth / 2;
    let playAgainY = overWindowY + overWindowHeight / 2 + 40;
    context.fillStyle = "rgb(58, 167, 8)";
    context.fillRect(playAgainX, playAgainY, playAgainWidth, playAgainHeight);

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "rgb(240, 195, 97)";

    context.fillText(
        "Play again",
        playAgainX + playAgainWidth / 2,
        playAgainY + playAgainHeight / 2);

    canvas.addEventListener("click", (event) => {
        let rect1 = canvas.getBoundingClientRect();
        let mouseX1 = event.clientX - rect1.left
        let mouseY1 = event.clientY - rect1.top;
        if (
            mouseX1 >= playAgainX &&
            mouseX1 <= playAgainX + playAgainWidth &&
            mouseY1 >= playAgainY &&
            mouseY1 <= playAgainY + playAgainHeight
        ) {
            
            location.reload();
        }
    })
}

function resetGame() {         /**ALUSTAA ALKUPERÄISET ARVOT JOS PELATAAN UUDESTAAN */
    blockX = window.innerWidth / 2 -25;
    blockY = window.innerHeight / 2 -25;
    gameActive = true;
    enemies = [];
    bullets = [];
    enemiesSecBetw = 3000;
    enemySpeed = 20;
    countHits = 0;
    player = {
        x: blockX,
        y: blockY,
        width: playerWidth,
        height: playerWidth
    };
    playerImg.onload = function() {
        context.drawImage(playerImg, blockX, blockY, playerWidth, playerWidth);
    };
    

}

function PauseGame(){
    if(isGamePaused==true){
        window.alert("PAUSE\nPress ok or escape to continue");
        isGamePaused=false;
    }
}
/*document.addEventListener("visibilitychange", () => {
    window.alert("PAUSE\nPress ok or escape to continue");
  });*/

document.addEventListener("keydown", function (keyInput) {//Ampumine ja liikkuminen erilaisena aikana
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
            createBullet(
                blockX + playerWidth / 2 - bulletSize / 2, 
                blockY,
                "up");
            break;
        case "ArrowDown":
            createBullet(
                blockX + playerWidth / 2 - bulletSize / 2,
                blockY + playerWidth,
                "down"
                );
            break;
        case "ArrowLeft":
            createBullet(
                blockX, 
                blockY + playerWidth / 2 - bulletSize / 2,
                "left"
            );
            break;
        case "ArrowRight":
            createBullet(
                blockX + playerWidth,
                blockY + playerWidth / 2 - bulletSize / 2,
                "right"
            );
            break;
        case "Escape":
            isGamePaused=true;
            break
    }
});


//ampuminen ja liikuminen samana aikana
let keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (keysPressed['w'] && keysPressed['a'] || keysPressed['a'] && keysPressed['w']) {
        moveDioganalyLeftUp();
    } else if (keysPressed['w'] && keysPressed['d'] || keysPressed['d'] && keysPressed['w']) {
        moveDioganalyRightUp();
    } else if (keysPressed['s'] && keysPressed['a'] || keysPressed['a'] && keysPressed['s']) {
        moveDioganalyLeftDown()
    } else if (keysPressed['s'] && keysPressed['d'] || keysPressed['d'] && keysPressed['s']) {
        moveDioganalyRightDown();
    };

    function handleMovementDirection(directionMove,directionShoot){
        createBullet(
            blockX + playerWidth / 2 - bulletSize / 2, 
            blockY,
            directionShoot);
        switch(directionMove){
            case "up":
                moveBlockUp();
                break;
            case "down":
                moveBlockDown();
                break;
            case "right":
                moveBlockRight();
                break;
            case "left":
                moveBlockLeft();
                break;
            case "leftUp":
                moveDioganalyLeftUp();
                break;
            case "leftDown":
                moveDioganalyLeftDown();
                break;
            case "rightUp":
                moveDioganalyRightUp();
                break;
            case "rightDown":
                moveDioganalyRightDown();
                break;
        }
    };
    
    if (keysPressed['ArrowUp'] && keysPressed['w'] || keysPressed['w'] && keysPressed['ArrowUp']) {//Ylös liikkuminen ylös ampuminen
        handleMovementDirection("up","up");
    }else if (keysPressed['ArrowDown'] && keysPressed['w'] || keysPressed['w'] && keysPressed['ArrowDown']) {//Ylös liikkuminen alas ampuminen
        handleMovementDirection("up","down");
    }else if (keysPressed['ArrowLeft'] && keysPressed['w'] || keysPressed['w'] && keysPressed['ArrowLeft']) {//Ylös liikkuminen vasemmale ampuminen
        handleMovementDirection("up","left");
    }else if (keysPressed['ArrowRight'] && keysPressed['w'] || keysPressed['w'] && keysPressed['ArrowRight']) {//Ylös liikkuminen oikealle ampuminen
        handleMovementDirection("up","right");
    }else if (keysPressed['ArrowLeft'] && keysPressed['s'] || keysPressed['s'] && keysPressed['ArrowLeft']) {//Alas liikkuminen vasemmale ampuminen
        handleMovementDirection("down","left");
    }else if (keysPressed['ArrowRight'] && keysPressed['s'] || keysPressed['s'] && keysPressed['ArrowRight']) {//Alas liikkuminen oikealle ampuminen
        handleMovementDirection("down","right");
    }else if (keysPressed['ArrowDown'] && keysPressed['s'] || keysPressed['s'] && keysPressed['ArrowDown']) {//Alas liikkuminen alas ampuminen
        handleMovementDirection("down","down");
    }else if (keysPressed['ArrowUp'] && keysPressed['s'] || keysPressed['s'] && keysPressed['ArrowUp']) {//Alas liikuminen ylös ampuminen
        handleMovementDirection("down","up");
    }else if (keysPressed['ArrowRight'] && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowRight']) {//Liikkuminen oikealle oikealle ampuminen
        handleMovementDirection("right","right");
    }else if (keysPressed['ArrowLeft'] && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowLeft']) {//Liikkuminen oikealle vasemmalle ampuminen
        handleMovementDirection("right","left");
    }else if (keysPressed['ArrowUp'] && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowUp']) {//Liikkuminen oikealle ylös ampuminen
        handleMovementDirection("right","up");
    }else if (keysPressed['ArrowDown'] && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowDown']) {//Liikkuminen oikealle alas ampuminen
        handleMovementDirection("right","down");
    }else if (keysPressed['ArrowRight'] && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowRight'] ) {//Liikkuminen vasemmale oikealle ampuminen
        handleMovementDirection("left","right");
    }else if (keysPressed['ArrowLeft'] && keysPressed['a']  || keysPressed['a'] && keysPressed['ArrowLeft'] ) {//Liikkuminen vasemmale vasemmalle ampuminen
        handleMovementDirection("left","left");
    }else if (keysPressed['ArrowUp'] && keysPressed['a']  || keysPressed['a'] && keysPressed['ArrowUp'] ) {//Liikkuminen vasemmale ylös ampuminen
        handleMovementDirection("left","up");
    }else if (keysPressed['ArrowDown'] && keysPressed['a']  || keysPressed['a'] && keysPressed['ArrowDown'] ) {//Liikkuminen vasemmale alas ampuminen
        handleMovementDirection("left","down");
    //Ylös vasemmalle diagonalilla liikkuminen ja ampuminen
    }else if (keysPressed['w'] && keysPressed['a'] && keysPressed['ArrowRight'] || keysPressed['ArrowRight'] && keysPressed['w'] && keysPressed['a'] || keysPressed['w'] && keysPressed['ArrowRight']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowRight']  && keysPressed['w']) {
        handleMovementDirection("leftUp","right");
    }else if (keysPressed['w'] && keysPressed['a'] && keysPressed['ArrowLeft'] || keysPressed['ArrowLeft'] && keysPressed['w'] && keysPressed['a'] || keysPressed['w'] && keysPressed['ArrowLeft']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowLeft']  && keysPressed['w']) {
        handleMovementDirection("leftUp","left");
    }else if (keysPressed['w'] && keysPressed['a'] && keysPressed['ArrowUp'] || keysPressed['ArrowUp'] && keysPressed['w'] && keysPressed['a'] || keysPressed['w'] && keysPressed['Arrowup']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowUp']  && keysPressed['w']) {
        handleMovementDirection("leftUp","up");
    }else if (keysPressed['w'] && keysPressed['a'] && keysPressed['ArrowDown'] || keysPressed['ArrowDown'] && keysPressed['w'] && keysPressed['a'] || keysPressed['w'] && keysPressed['ArrowDown']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowDown']  && keysPressed['w']) {
        handleMovementDirection("leftUp","down");
    }
    //Ylös oikealle diagonalilla liikkuminen ja ampuminen
    else if (keysPressed['w'] && keysPressed['d'] && keysPressed['ArrowRight'] || keysPressed['ArrowRight'] && keysPressed['w'] && keysPressed['d'] || keysPressed['w'] && keysPressed['ArrowRight']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowRight']  && keysPressed['w']) {
        handleMovementDirection("RightUp","right");
    }else if (keysPressed['w'] && keysPressed['d'] && keysPressed['ArrowLeft'] || keysPressed['ArrowLeft'] && keysPressed['w'] && keysPressed['d'] || keysPressed['w'] && keysPressed['ArrowLeft']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowLeft']  && keysPressed['w']) {
        handleMovementDirection("RightUp","left");
    }else if (keysPressed['w'] && keysPressed['d'] && keysPressed['ArrowUp'] || keysPressed['ArrowUp'] && keysPressed['w'] && keysPressed['d'] || keysPressed['w'] && keysPressed['Arrowup']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowUp']  && keysPressed['w']) {
        handleMovementDirection("RightUp","up");
    }else if (keysPressed['w'] && keysPressed['d'] && keysPressed['ArrowDown'] || keysPressed['ArrowDown'] && keysPressed['w'] && keysPressed['d'] || keysPressed['w'] && keysPressed['ArrowDown']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowDown']  && keysPressed['w']) {
        handleMovementDirection("RightUp","down");
    }
    //Alas vasemmalle diagonalilla liikkuminen ja ampuminen
    else if (keysPressed['s'] && keysPressed['a'] && keysPressed['ArrowRight'] || keysPressed['ArrowRight'] && keysPressed['s'] && keysPressed['a'] || keysPressed['s'] && keysPressed['ArrowRight']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowRight']  && keysPressed['s']) {
        handleMovementDirection("leftDown","right");
    }else if (keysPressed['s'] && keysPressed['a'] && keysPressed['ArrowLeft'] || keysPressed['ArrowLeft'] && keysPressed['s'] && keysPressed['a'] || keysPressed['s'] && keysPressed['ArrowLeft']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowLeft']  && keysPressed['s']) {
        handleMovementDirection("leftDown","left");
    }else if (keysPressed['s'] && keysPressed['a'] && keysPressed['ArrowUp'] || keysPressed['ArrowUp'] && keysPressed['s'] && keysPressed['a'] || keysPressed['s'] && keysPressed['Arrowup']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowUp']  && keysPressed['s']) {
        handleMovementDirection("leftDown","up");
    }else if (keysPressed['s'] && keysPressed['a'] && keysPressed['ArrowDown'] || keysPressed['ArrowDown'] && keysPressed['s'] && keysPressed['a'] || keysPressed['s'] && keysPressed['ArrowDown']  && keysPressed['a'] || keysPressed['a'] && keysPressed['ArrowDown']  && keysPressed['s']) {
        handleMovementDirection("leftDown","down");
    }
    //Alas oikealle diagonalilla liikkuminen ja ampuminen
    else if (keysPressed['s'] && keysPressed['d'] && keysPressed['ArrowRight'] || keysPressed['ArrowRight'] && keysPressed['s'] && keysPressed['d'] || keysPressed['s'] && keysPressed['ArrowRight']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowRight']  && keysPressed['d']) {
        handleMovementDirection("rightDown","right");
    }else if (keysPressed['s'] && keysPressed['d'] && keysPressed['ArrowLeft'] || keysPressed['ArrowLeft'] && keysPressed['s'] && keysPressed['d'] || keysPressed['s'] && keysPressed['ArrowLeft']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowLeft']  && keysPressed['d']) {
        handleMovementDirection("rightDown","left");
    }else if (keysPressed['s'] && keysPressed['d'] && keysPressed['ArrowUp'] || keysPressed['ArrowUp'] && keysPressed['s'] && keysPressed['d'] || keysPressed['s'] && keysPressed['Arrowup']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowUp']  && keysPressed['d']) {
        handleMovementDirection("rightDown","up");
    }else if (keysPressed['s'] && keysPressed['d'] && keysPressed['ArrowDown'] || keysPressed['ArrowDown'] && keysPressed['s'] && keysPressed['d'] || keysPressed['s'] && keysPressed['ArrowDown']  && keysPressed['d'] || keysPressed['d'] && keysPressed['ArrowDown']  && keysPressed['d']) {
        handleMovementDirection("rightDown","down");
    }
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});


function refreshAll() {
    if (gameActive) {
        context.clearRect(0, 0, canvas.width, canvas.height);   /*TYHJENTÄÄ KANVAKSEN*/
        moveBlockDown();
        moveBlockLeft();                           /*NÄMÄ FUNKTIOT LUO UUDELLEEN OBJEKTIT*/
        moveBlockRight();
        moveBlockUp();
        drawEnemies();
        moveEnemies();
        drawBullets();
        refreshBullets();
        enemyHoles();
        PauseGame();
        requestAnimationFrame(refreshAll);
    }
    
}

refreshAll();

function startGame() {
    setInterval(createEnemies, enemiesSecBetw);  /*LÄHETTÄÄ VIHOLLISIA 3 SEKUNNIN VÄLEIN*/
}
function updateInterval() {              
    clearInterval(intervalId);              /**KUN 10 OSUMAA VIHOLLISIA NOPEAMMIN */
    intervalId = setInterval(createEnemies, enemiesSecBetw);
}
