class Sprite {
    constructor(posX, posY, speedX, speedY, width, height, url, rotation) {
        this.X = posX;
        this.Y = posY;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = width;
        this.height = height;
        this.url = url;
        this.image = new Image();
        this.alive = true;
        if (typeof (url) !== 'undefined') {
            this.image.src = url;
        } else {
            console.warn('No URL specified for sprite');
        }
        this.rotation = rotation;
    }

    update() {
        this.X += this.speedX;
        this.Y += this.speedY;
    }

    draw() {
        ctx.translate(this.X + this.width / 2, this.Y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.rotate(-this.rotation);
        ctx.translate(-(this.X + this.width / 2), -(this.Y + this.height / 2));
    }
}

