import Ball from '../src/ball';
import Bg from '../src/bg';
import Land from '../src/land';
import img_bg from '../public/images/bg3.png';
import img_land from '../public/images/land1.png';
import img_ball from '../public/images/ball1.png';

;[function(){
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = 800;
    let h = canvas.height = 600;

    app.style.backgroundColor = "#000";
    app.style.width = document.body.clientWidth + "px";
    app.style.height = document.body.clientHeight + "px";
    app.style.position="relative";

    canvas.style.backgroundColor="#FFF";
    canvas.style.position="absolute";
    canvas.style.left="50%";
    canvas.style.top="50%";
    canvas.style.marginLeft=-(w/2) + "px";
    canvas.style.marginTop= -(h/2) + "px";
    app.append(canvas);

    window.addEventListener("resize",()=>{
        app.style.width = document.body.clientWidth + "px";
        app.style.height = document.body.clientHeight + "px";
    });

    

    const ctx = canvas.getContext("2d");

    let bg = new Bg({ctx});
    let land = new Land({
        ctx,
        src:img_land
    }).render();

    let ball = new Ball({
        vx:2,
        vy:5,
        x:50,
        y:100,
        fillStyle:"#6140de",
        r:20,
        angle:0,
        src:img_ball
    }).render(ctx);


    ;(function run(){
        window.requestAnimationFrame(run);
        ctx.clearRect(0,0,w,h);
        bg.draw(img_bg);
        land.draw();
        ball.y += ball.vy;
        ball.x += ball.vx;
        if(ball.y + ball.r > h - land.height){
            ball.y = h -land.height - ball.r;
            ball.vy*=-0.8;
            ball.vx -=0.2;
        }


        if(ball.vx<=0){
            ball.vx=0;
        }else{
            ball.angle+=0.05;
        }

        ball.render(ctx);

        ball.vy +=0.3;

    }());

}()];


