alert('Welkom bij mijn game! Gebruik de pijltjestoetsen om te bewegen. Je moet 5 keer de Yoshi raken (of schieten met spatie) om te winnen. Succes! Ben je op een mobiel? Ga dan met je vinger naar links of rechts om te bewegen.');

let ctx, canvasWidth, canvasHeight, mouseX = 0, mouseY = 0, touchX = 0, touchY = 0, touchUsed = false;
const fps = 60;
const fpsInterval = 1000 / fps;
canvasHeight = 800;
canvasWidth = 600;
const sprite2Array = [];
let leftKeyPressed = false;
let rightKeyPressed = false;
let image;
let score = 0;

function start() {
    let next;
    (function gameloop(timestamp) {
        if (next === undefined) { next = timestamp; }
        const difference = timestamp - next;
        if (difference > fpsInterval) {
            next = timestamp - (difference % fpsInterval);
            update();
            draw();
        }
        requestAnimationFrame(gameloop);
    })();
}

function init() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    image = new Image();
    image.src = 'image/clouds.jpeg';

    image.onload = function () {
        sprite1 = new Sprite(10, 510, 5, 0, 30, 90, 'image/mario.png');
        const spacing = 100;
        for (let i = 0; i < 5; i++) {
            const randomX = 50 + i * spacing;
            const randomY = canvasHeight / 2 - 25;
            const randomSpeedY = Math.random() * 4 + 1;
            sprite2Array.push(new Sprite(randomX, randomY, 0, randomSpeedY, 50, 50, 'image/yoshi.png'));
        }
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchstart', () => { touchUsed = true; });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        bullets = [];
        for (let i = 0; i < 5; i++) {
            let bullet = new Sprite(0, 0, 0, -6, 10, 10, 'image/bullet.png');
            bullet.alive = false;
            bullets.push(bullet);
        }

        start();
    };
}

function handleMouseMove(event) {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
}

function handleTouchMove(event) {
    event.preventDefault();
    touchX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    touchY = event.touches[0].clientY - canvas.getBoundingClientRect().top;
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        leftKeyPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightKeyPressed = true;
    } else if (event.code === 'Space') {
        shootBullet();
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft') {
        leftKeyPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightKeyPressed = false;
    }
}

function shootBullet() {
    for (let i = 0; i < bullets.length; i++) {
        if (!bullets[i].alive) {
            bullets[i].X = sprite1.X + sprite1.width / 2 - bullets[i].width / 2;
            bullets[i].Y = sprite1.Y;
            bullets[i].alive = true;
            break;
        }
    }
}

function updateBullets() {
    for (const bullet of bullets) {
        if (bullet.alive) {
            bullet.update();
            for (let i = 0; i < sprite2Array.length; i++) {
                const sprite2 = sprite2Array[i];
                const dx = bullet.X + bullet.width / 2 - (sprite2.X + sprite2.width / 2);
                const dy = bullet.Y + bullet.height / 2 - (sprite2.Y + sprite2.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < bullet.width / 2 + sprite2.width / 2) {
                    bullet.alive = false;
                    sprite2Array.splice(i, 1);
                    i--;
                    score++;
                    if (score === 5) {
                        alert('WON!');
                        resetGame();
                    }
                }
            }
            if (bullet.Y < 0) {
                bullet.alive = false;
            }
        }
    }
}

function drawBullets() {
    for (const bullet of bullets) {
        if (bullet.alive) {
            bullet.draw();
        }
    }
}

function update() {
    if (leftKeyPressed && sprite1.X > 0) {
        sprite1.X -= sprite1.speedX;
    }
    if (rightKeyPressed && sprite1.X + sprite1.width < canvasWidth) {
        sprite1.X += sprite1.speedX;
    }

    if (touchUsed) {
        const touchThreshold = 30;
        const touchDeltaX = touchX - sprite1.X - sprite1.width / 2;
        if (Math.abs(touchDeltaX) > touchThreshold) {
            sprite1.X += Math.sign(touchDeltaX) * sprite1.speedX;
        }
    }

    for (let i = 0; i < sprite2Array.length; i++) {
        const sprite2 = sprite2Array[i];
        const dx = sprite1.X + sprite1.width / 2 - (sprite2.X + sprite2.width / 2);
        const dy = sprite1.Y + sprite1.height / 2 - (sprite2.Y + sprite2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < sprite1.width / 2 + sprite2.width / 2) {
            sprite2Array.splice(i, 1);
            i--;
            score++;
            if (score === 5) {
                alert('WON!');
                resetGame();
            }
        }
    }

    for (const sprite2 of sprite2Array) {
        sprite2.update();
        const dx = sprite1.X + sprite2.width / 2 - (touchX || mouseX);
        const dy = sprite1.Y + sprite2.height / 2 - (touchY || mouseY);
        sprite2.rotation = Math.atan2(dy, dx);
        sprite2.Y += sprite2.speedY;
        if (sprite2.Y < 0 || sprite2.Y + sprite2.height > canvasHeight) {
            sprite2.speedY = -sprite2.speedY;
        }
    }

    updateBullets();
}

function resetGame() {
    location.reload();
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    sprite1.draw();

    for (const sprite2 of sprite2Array) {
        sprite2.draw();
    }

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 600, 800, 200);

    drawBullets();
}

init();
