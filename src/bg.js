const { loadImg } = require("@src/untils");

class Bg {
    constructor({ ctx, src = "", angle = 0, scale = 1, color = "#000000" }) {
        this.w = ctx.canvas.width;
        this.h = ctx.canvas.height;
        this.ctx = ctx;
        this.src = src;
        this.alpha = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.img = null;
        this.x = this.w / 2;
        this.y = this.h / 2;
        this.angle = angle;
        this.scale = scale;
        this.color = color;
        this.scaleX = this.scaleY = this.scale;
        return this;
    }
    render(src = "") {
        this.src = src;
        this.w = this.ctx.canvas.width;
        this.h = this.ctx.canvas.height;
        this.x = this.w / 2;
        this.y = this.h / 2;
        this.draw(this.src);
    }
    draw(src) {
        this.angle = this.angle % 360;
        const { w, h, img, scaleX, scaleY, ctx, alpha, x, y, angle } = this;
        if (img) {
            let [width, height] = [img.width, img.height];
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, w, h);
            ctx.translate(x, y);
            ctx.scale(scaleX, scaleY);
            ctx.globalAlpha = alpha;
            ctx.rotate(angle);
            ctx.drawImage(img, -width / 2, -height / 2);

            ctx.restore();
            return;
        }
        loadImg(src)
            .then(img => {
                this.img = img;
            });
    }
}


module.exports = Bg;