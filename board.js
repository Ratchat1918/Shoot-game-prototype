var score = document.getElementById("scoreBoard");
var context = score.getContext('2d');
score.width = window.innerWidth * 0.25;
score.height = window.innerHeight;

context.font = "40px Arial";
var textWidth = context.measureText("Scoreboard").width;
var textMiddle = (score.width - textWidth) / 2;
context.fillText("Scoreboard", textMiddle, 50);