import bg1 from "@images/bg1.jpg";
import Bg from "@src/bg";
import Ball from "@src/ball";

;[function () {
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    app.append(canvas);

    
    ctx.fillRect(0,0,w,h);
    let cbg =new Bg({
        ctx,
        angle:0,
        scale:0.8
    });

    let num = 50;
    
    const ballBox= [];
    
    for (let i = 0; i < num; i++) {
        ballBox.push(new Ball({
            sx: w * Math.random()+50,
            sy: h * Math.random()+50,
            r: 1 + Math.random(),
            speed: 0.1 * Math.random()*0.1,
            angle:Math.random()*Math.PI*2,
            alpha:0.7+0.3*Math.random()
        }));       
    }

    window.onresize = ()=>{
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        cbg.render();
    }

    (function run(){
        window.requestAnimationFrame(run);
        ctx.clearRect(0,0,w,h);
        cbg.scaleX = cbg.scaleY = cbg.scale + Math.sin(cbg.angle)*0.1;
        cbg.angle += 0.002;
        cbg.angle %= Math.PI * 2;
        cbg.draw(bg1);
        ballBox.forEach(ball=>{   
            ball.round = Math.sqrt(Math.pow(ball.sx-w/2,2)+Math.pow(ball.sy-h/2,2));

            // ctx.beginPath();
            // ctx.strokeStyle="rgba(120,243,57,0.5)"
			// ctx.arc(w/2,h/2,ball.round,0,Math.PI*2);
			// ctx.stroke();
            // ctx.closePath();

            ball.x=ball.round*Math.cos(ball.angle)+w/2;
            ball.y=ball.round*Math.sin(ball.angle)+h/2;
            ball.angle += ball.speed;
            ball.angle %= Math.PI * 2;
            ball.render(ctx);
        });
    })();
    


    console.log(ctx);

}()];
