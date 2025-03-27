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

        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            if (checkHit(bullet, enemy)) {
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

function checkHit(bullet, enemy) {
    return (
        bullet.x < enemy.x + enemy.enemySize &&
        bullet.x + bulletSize > enemy.x &&
        bullet.y < enemy.y + enemy.enemySize &&
        bullet.y + bulletSize > enemy.y
    );
}

function drawBullets() {
    context.fillStyle = "red";
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    }
}

function shoot(e) {

    if (e.key === "ArrowUp") {
        createBullet(
            blockX + 50 / 2 - bulletSize / 2, 
            blockY,
            "up"
        );
    } else if (e.key === "ArrowDown") {
        createBullet(
            blockX + 50 / 2 - bulletSize / 2,
            blockY + 50,
            "down"
            );
    } else if (e.key === "ArrowLeft") {
        createBullet(
            blockX, 
            blockY + 50 / 2 - bulletSize / 2,
            "left"
        );
    } else if (e.key === "ArrowRight") {
        createBullet(
            blockX + 50,
            blockY + 50 / 2 - bulletSize / 2,
            "right"
        );
    }
}