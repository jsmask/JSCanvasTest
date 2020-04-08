import { loadImg } from '../src/untils';

class Ball {
	constructor(arg) {
		this.x = 0;
		this.y = 0;
		this.r = 2;
		this.x3d = 0;
		this.y3d = 200;
		this.z3d = 0;
		this.fillStyle = "rgba(255,255,255,1)";
		this.strokeStyle = "rgba(0,0,0,0)";
		this.alpha = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.src = "";
		Object.assign(this, arg);
		return this;
	}
	render(ctx) {
		let { x, y, r, fillStyle, strokeStyle, alpha, scaleX, scaleY, angle } = this;
		if (this.src) {
			this.loadSkin().then(() => {
				this.drawSkin(ctx);
			})
		} else {
			ctx.save();
			ctx.fillStyle = fillStyle;
			ctx.strokeStyle = strokeStyle;
			ctx.translate(x, y);
			ctx.scale(scaleX, scaleY);
			ctx.rotate(angle);
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
		return this;
	}
	loadSkin() {
		return new Promise((resolve, reject) => {
			if (this.src == "") resolve();
			if (this.img) resolve();
			loadImg(this.src).then(img => {
				this.img = img;
				this.img.width = this.img.height = this.r * 2;
				resolve();
			});
		});
	}

	drawSkin(ctx) {
		let { x, y, r, fillStyle, strokeStyle, alpha, scaleX, scaleY, angle } = this;
		ctx.save();
		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.translate(x, y);
		ctx.scale(scaleX, scaleY);
		ctx.rotate(angle);
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2, this.img.width, this.img.height);
		ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
		ctx.clip();
		ctx.closePath();
		ctx.beginPath();
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
}

module.exports = Ball;

