import {loadImg} from '../src/untils';

class Land {
    constructor(args){
        this.ctx = null;
        this.img = null;
        this.x = 0; 
        this.y = 0;
        this.bottom = 0;
        this.src = "";
        this.w =  0;
        this.h =  0;
        Object.assign(this,args);
        return this;
    }
    render(){
        if(this.ctx==null) return;
        this.w=this.ctx.canvas.width;
        this.h=this.ctx.canvas.height;
        
        loadImg(this.src).then(img=>{
            this.img = img;
            this.width = img.width;
            this.height = img.height;
            this.y = this.h - img.height;
            this.draw();
        });
        return this;
    }
    draw(){
        if(this.ctx==null||this.img == null) return;
        const {ctx,x,y,w,h,img,width,height} = this;
        ctx.save();
        let pattern = ctx.createPattern(img,"repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(x,y,w,height);
        ctx.restore();
        return this;
    }
}

module.exports = Land;