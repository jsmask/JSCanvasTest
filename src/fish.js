import { loadImg } from '@src/untils';

class Fish {
    constructor(args) {
        this.x = 0;
        this.y = 0;
        this.rows = [1, 1];
        this.src = "";
        this.w = 0;
        this.h = 0;
        this.width = 0;
        this.height = 0;
        this.rotation = 0;
        this.scale = 1;
        Object.assign(this, args);
        return this;
    }
    render(ctx) {
        this.ctx = ctx;
        this.rw = 0;
        this.rh = 0;
        loadImg(this.src).then(img => {
            this.img = img;
            this.width = img.width
            this.height = img.height;
            this.w = img.width / this.rows[0];
            this.h = img.height / this.rows[1];
        });
        return this;
    }
    draw() {
        let { x, y, ctx, img, w, h,rows,mh,mw,rotation,scale } = this;
        if (!ctx || !img) return;
        this.rw%=mw||rows[0];
        this.rh%=mh||rows[1];
        ctx.save();
        ctx.translate(x,y);
        ctx.scale(scale,scale);
        ctx.rotate(rotation);
        ctx.drawImage(img,w*this.rw, h*this.rh, w, h, -w/2, -h/2,w,h);        
        ctx.restore();
    }
    updated(dt) {
        this.draw();
        var _dt = dt;
        _dt %= 7;
        if(_dt==0){
            this.rw++;
            this.rh++;
        }
    }
}

module.exports = Fish;