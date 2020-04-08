module.exports = {
    loadImg(src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = err => reject(err);
            img.oncomplete = () => resolve(img);
            img.src = src;
        });
    },
    random(min, max) {
        return ~~(Math.random() * (max - min) + min);
    },
    randomColor(){
        return "#"+Math.floor(Math.random()*0xffffff).toString(16).padEnd(6,0);
    },
    rp(arr, int){
        const max = Math.max(...arr);
        const min = Math.min(...arr);
        const num = Math.random() * (max - min) + min;
        return int ? Math.round(num) : num;
    },
    checkBallHit(b1, b2){
        let dx = b2.x - b1.x;
        let dy = b2.y - b1.y;
        let dist = Math.sqrt(dx**2 + dy**2);
        if(dist < b1.r + b2.r){
          let angle = Math.atan2(dy, dx);
          let sin = Math.sin(angle);
          let cos = Math.cos(angle);
          
          // 以b1为参照物，设定b1的中心点为旋转基点
          let x1 = 0;
          let y1 = 0;
          let x2 = dx * cos + dy * sin;
          let y2 = dy * cos - dx * sin;
          
          // 旋转b1和b2的速度
          let vx1 = b1.vx * cos + b1.vy * sin;
          let vy1 = b1.vy * cos - b1.vx * sin;
          let vx2 = b2.vx * cos + b2.vy * sin;
          let vy2 = b2.vy * cos - b2.vx * sin;
          
          // 求出b1和b2碰撞之后的速度
          let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m);
          let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m);
          
          // 处理两个小球碰撞之后，将它们进行归位
          let lep = (b1.r + b2.r) - Math.abs(x2 - x1);
          
          x1 = x1 + (vx1Final < 0 ? -lep/2 : lep/2);
          x2 = x2 + (vx2Final < 0 ? -lep/2 : lep/2);
          
          b2.x = b1.x + (x2 * cos - y2 * sin);
          b2.y = b1.y + (y2 * cos + x2 * sin);
          b1.x = b1.x + (x1 * cos - y1 * sin);
          b1.y = b1.y + (y1 * cos + x1 * sin);
          
          b1.vx = vx1Final * cos - vy1 * sin;
          b1.vy = vy1 * cos + vx1Final * sin;
          b2.vx = vx2Final * cos - vy2 * sin;
          b2.vy = vy2 * cos + vx2Final * sin;
        }
    }
}