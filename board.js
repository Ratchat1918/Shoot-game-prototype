var score = document.getElementById("scoreBoard");
var context1 = score.getContext('2d');
score.width = window.innerWidth * 0.25;
score.height = window.innerHeight;

var fontSize = Math.floor(score.width * 0.12);
var hitsInScoreBoard = 0;
context1.font = fontSize + "px Arial";

function head() {
    var headTextWidth = context1.measureText("Scoreboard").width;
    var headTextMiddle = (score.width - headTextWidth) / 2;
    context1.fillText("Scoreboard", headTextMiddle, 50);
}

function ScoreBoardHits() {
    hitsInScoreBoard += 1;
    console.log(hitsInScoreBoard);
    killedEnemies();
}

function killedEnemies() {
    context1.clearRect(0, 100, score.width, 200);
    var hitsTextWidth = context1.measureText("Killed enemies: " + hitsInScoreBoard).width;
    var hitsTextMiddle = (score.width - hitsTextWidth) / 2
    context1.fillText("Killed enemies: " + hitsInScoreBoard, hitsTextMiddle, 150);
}

function refreshScoreBoard() {
    head();
    killedEnemies();

    requestAnimationFrame(refreshScoreBoard);
}

refreshScoreBoard();