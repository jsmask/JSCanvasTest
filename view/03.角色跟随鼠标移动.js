
import Bg from '@src/bg';
import Fish from '@src/fish';
import img_bg from "@images/bg2.png";
import img_fish from '@images/sea.png';
import img_fish1 from '@images/fish1.png';
 
;[function () {
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    app.append(canvas);
    let bg = new Bg({ctx,scale:2});
    let fish = null;
    fish = new Fish({
        x:w/2,
        y:h/2,
        src:img_fish,
        rows:[1,10],
        mh:6,
        speed:3
    }).render(ctx);

    // fish = new Fish({
    //     x:w/2,
    //     y:h/2,
    //     src:img_fish1,
    //     rows:[1,12],
    //     mh:8,
    //     speed:5
    // }).render(ctx);

    let dt = 0;
    let offsetX=w/2;
    let offsetY=h/2;

    ;(function run(){
        window.requestAnimationFrame(run);
        ctx.clearRect(0,0,w,h);
        bg.draw(img_bg);
        drawFish();
    }());

    function drawFish(){
        let dx = offsetX - fish.x;
        let dy = offsetY - fish.y;
        let angle=Math.atan2(dy,dx);
        if((dx<10&&dx>-10)&&(dy<10&&dy>-10)){

        }
        else{
            let vx=fish.speed*Math.cos(angle);
            let vy=fish.speed*Math.sin(angle);
            fish.x+=vx;
            fish.y+=vy;           
        }
        fish.rotation =angle;

        dt++;
        dt%=7;
        fish.updated(dt);
    }

    canvas.addEventListener("mousemove",e=>{
        offsetX=e.offsetX;
        offsetY=e.offsetY;
    })

    // canvas.addEventListener("mouseup",e=>{
    //     offsetX=e.offsetX;
    //     offsetY=e.offsetY;
    //     console.log(offsetX,offsetY);
    //     console.log(fish.x,fish.y);
    // })

}()];