import { random } from '@src/untils'

const __TYPE = {
    WAIT: "wait",
    FALL: "fall",
    COMPLETE: "complete"
}


class Rain {
    constructor(args) {
        this.width = 3;
        this.height = 5;
        this.x = 0;
        this.y = -this.height;
        this.vx = -2.5;
        this.vy = 5;
        this.bgColor = "#ffffff";
        this.markColor = "#ffffff";
        Object.assign(this, args);
        this.init();
        return this;
    }
    init() {
        if (!this.ctx) return;
        this.x = random(this.w/4, this.w + this.w/4);
        this.y = random(-this.height, -this.height - 300);
        this.limit = random(this.h - 200, this.h - 100);
        this.vx = -2.5;
        this.vy = 5;
        this.status = __TYPE.WAIT;
        this.alpha = 1;
        this.r = 0;
        return this;
    }
    draw() {
        let { ctx, width, height, x, y, bgColor, status, r, alpha } = this;
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        switch (status) {
            case __TYPE.WAIT: 
                ctx.scale(1,1);
                ctx.fillStyle = bgColor;
                ctx.fillRect(x, y, width, height);
                break;
            case __TYPE.FALL:   
                ctx.strokeStyle = `rgba(45,178,165,${alpha})`;
                ctx.translate(x,y);
                if(this.vx!=0){            
                    ctx.scale(1,1/2);
                }
                ctx.arc(0, 0, r, 0, Math.PI * 2, false);
                ctx.stroke();
                break;
            case __TYPE.COMPLETE:
                this.init().draw();
                break;
            default:
                break;
        }
        ctx.closePath();
        ctx.restore();


        this.updated();
    }
    updated() {
        let { ctx, limit } = this;
        if (!ctx) return;
        if (this.y >= limit) {
            if (this.alpha > 0.25) {
                this.status = __TYPE.FALL;
                this.r += 1;
                this.alpha *= 0.98;
            }
            else {
                this.status = __TYPE.COMPLETE;
            }
        }
        else {
            this.y += this.vy
            this.x += this.vx;
        };
    }
}

module.exports = Rain;