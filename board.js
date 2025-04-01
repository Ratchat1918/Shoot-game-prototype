var score = document.getElementById("scoreBoard");
var context1 = score.getContext('2d');
score.width = window.innerWidth * 0.25;
score.height = window.innerHeight;

var fontSize = Math.floor(score.width * 0.12);
var hitsInScoreBoard = 0;
context1.font = fontSize + "px Arial";
var levelHeight = score.height * 0.05;
let lives = 3;

function head() {
    var headTextWidth = context1.measureText("Scoreboard").width;
    var headTextMiddle = (score.width - headTextWidth) / 2;
    context1.fillText("Scoreboard", headTextMiddle, score.height * 0.08);
}

function ScoreBoardHits() {
    hitsInScoreBoard += 1;
    killedEnemies();
}

function killedEnemies() {
    context1.clearRect(0, 100, score.width, 200);
    context1.save();
    context1.fillStyle = "black";
    var hitsTextWidth = context1.measureText("Killed enemies: " + hitsInScoreBoard).width;
    var hitsTextMiddle = (score.width - hitsTextWidth) / 2
    context1.fillText(
        "Killed enemies: " + hitsInScoreBoard, 
        hitsTextMiddle, 
        score.height * 0.18);
    context1.restore();
}

function level6() {
    var level6Width = score.width * 0.90;
    context1.save();
    if (hitsInScoreBoard > 49) {
        context1.fillStyle = "red";
        context1.fillRect(
            score.width / 2 - level6Width / 2,
            score.height * 0.25,
            level6Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level6Width / 2, 
        score.height * 0.25, 
        level6Width, 
        levelHeight);
    context1.restore();
}

function level5() {
    var level5Width = score.width * 0.75;
    context1.save();
    if (hitsInScoreBoard > 39) {
        context1.fillStyle = "orange";
        context1.fillRect(
            score.width / 2 - level5Width / 2,
            score.height * 0.3,
            level5Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level5Width / 2, 
        score.height * 0.3, 
        level5Width, 
        levelHeight);
    context1.restore();
}

function level4() {
    var level4Width = score.width * 0.60;
    context1.save();
    if (hitsInScoreBoard > 29) {
        context1.fillStyle = "yellow";
        context1.fillRect(
            score.width / 2 - level4Width / 2,
            score.height * 0.35,
            level4Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level4Width / 2, 
        score.height * 0.35, 
        level4Width, 
        levelHeight);
    context1.restore();
}

function level3() {
    var level3Width = score.width * 0.45;
    context1.save();
    if (hitsInScoreBoard > 19) {
        context1.fillStyle = "green";
        context1.fillRect(
            score.width / 2 - level3Width / 2,
            score.height * 0.4,
            level3Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level3Width / 2, 
        score.height * 0.4, 
        level3Width, 
        levelHeight);
    context1.restore();
}

function level2() {
    var level2Width = score.width * 0.30;
    context1.save();
    if (hitsInScoreBoard > 9) {
        context1.fillStyle = "blue";
        context1.fillRect(
            score.width / 2 - level2Width / 2,
            score.height * 0.45,
            level2Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level2Width / 2,
        score.height * 0.45, 
        level2Width, 
        levelHeight
    );
    context1.restore();
}

function level1() {
    var level1Width = score.width * 0.15;
    context1.save();
    if (hitsInScoreBoard > 0) {
        context1.fillStyle = "grey";
        context1.fillRect(
            score.width / 2 - level1Width / 2, 
            score.height * 0.5, 
            level1Width, 
            levelHeight
        );
    }
    context1.strokeRect(
        score.width / 2 - level1Width / 2, 
        score.height * 0.5, 
        level1Width, 
        levelHeight
    );
    context1.restore();
}

function level() {
    var levelTextWidth = context1.measureText("Game level").width;
    var levelTextMiddle = (score.width - levelTextWidth) / 2;
    context1.fillText("Game level", levelTextMiddle, score.height * 0.63); 
}

function checkLives() {
    
    if (lives === 0) {
        console.log("Peli päättyi");
        //gameOver();
    } else {
        lives -= 1;
        console.log(lives + " elämät");
        livesText();
    }
}

function livesText() {
    context1.clearRect(0, score.height * 0.68, score.width, score.height * 0.06);
    let livesTextWidth = context1.measureText("Lives: " + lives).width;
    let livesTextMiddle = (score.width - livesTextWidth) / 2;
    context1.fillStyle = "black";
    context1.fillText(
        "Lives: " + lives, 
        livesTextMiddle, 
        score.height * 0.72);
}

head();
level();
livesText();
function refreshScoreBoard() {
    
    killedEnemies();
    level6();
    level5();
    level4();
    level3();
    level2();
    level1();
    
    requestAnimationFrame(refreshScoreBoard);
}

refreshScoreBoard();