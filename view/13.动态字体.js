import Ball from '../src/ball';
import { rp, randomColor } from '../src/untils'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let box = document.createElement("div");
        let input = document.createElement("input");
        let button = document.createElement("button");
        let submit = document.createElement("button");
        let msg = document.createElement("span");
        let w = canvas.width = 850;
        let h = canvas.height = 620;
        let ctx = canvas.getContext("2d");
        app.style.backgroundColor = "#000";
        app.style.width = document.body.clientWidth + "px";
        app.style.height = document.body.clientHeight + "px";
        app.style.position = "relative";
        canvas.style.backgroundColor = "#FFF";
        canvas.style.position = "absolute";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.marginLeft = -(w / 2) + "px";
        canvas.style.marginTop = -(h / 2) + "px";
        button.innerHTML = "消散";
        button.className = "btn";
        input.style.marginRight = "20px";
        input.maxLength = 4;
        input.className = "ipt";

        submit.innerHTML = "生成";
        submit.className = "btn";
        submit.style.backgroundColor = "#65C120";
        submit.style.borderColor = "#65C120";
        submit.style.marginRight = "20px";

        box.style.width = w + "px";
        box.style.height = "50px";
        box.style.backgroundColor = "#FFF";
        box.style.position = "absolute";
        box.style.left = "50%";
        box.style.top = "50%";
        box.style.marginLeft = -(w / 2) + "px";
        box.style.marginTop = -(h / 2)-50 + "px";
        box.style.textAlign = "left";
        box.style.lineHeight = "50px";
        box.style.boxSizing = "border-box";
        box.style.padding = "0 20px";
        box.style.backgroundColor = "#f2f2f2";
        msg.style.marginRight="70px";
        msg.style.fontSize = "12px";
        msg.style.display="inline-block";
        msg.style.width="250px";

        app.append(canvas);
        app.append(box);
        box.append(msg)
        box.append(input);
        box.append(submit);
        box.append(button);

        window.onresize=function(){
            app.style.width = document.body.clientWidth + "px";
            app.style.height = document.body.clientHeight + "px";
        }

        let balls = [],g=0.2,isMoveing=false;

        input.value = "难受";

        submit.addEventListener("click",e=>{
            let txt = input.value;
            if(txt=="") return;
            createTxt(txt);
        });

        submit.dispatchEvent(new Event("click"));

        button.addEventListener("click",e=>{
            isMoveing = true;
        });

        function createTxt(txt){
            msg.innerHTML = "正在生成中...";
            isMoveing = false;
            balls.length = 0;
            setTimeout(()=>{
                drawTxt(txt);
                checkPX().then(()=>{
                    ctx.clearRect(0,0,w,h);
                    msg.innerHTML = ""
                });
            },50);
        }

        function drawTxt(txt) {
            let size = 200;
            var len = 0;  
            for (var i = 0 ; i<txt.length; i++) {  
              if (txt.charCodeAt(i)>127 || txt.charCodeAt(i)==94) {
                 len += 2;
               } else {  
                 len ++;  
               }
            }
            len /= 2;
            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            ctx.font = `${size}px bolder 微软雅黑`;
            ctx.textBaseline ="middle";
            ctx.fillText(txt, (w-size*len)/2, 300);
            ctx.restore();
        }

        function checkPX(){
            let fillStyle = randomColor();
            return new Promise((resolve,reject)=>{
                for (let y = 1; y < h; y+=10) {
                    for (let x = 1; x < w; x+=10) {
                        let imageData = ctx.getImageData(x,y,1,1);
                        if(imageData.data[0]>170){
                            let ball = createBall();
                            ball.x = x;
                            ball.y = y;
                            ball.fillStyle = fillStyle;
                            balls.push(ball);
                        }
                    }     
                }
                resolve();
            });  
        }

        function createBall(){         
            return new Ball({
                vx:rp([-10,10]),
                vy:rp([-10,10]),
                r:3
            })
        }

        function drawBall(ball){
            ball.render(ctx);
        }

        function moveBall(ball,i){
            ball.vy += g;
            ball.x += ball.vx;
            ball.y += ball.vy;

            if(ball.x - ball.r < 0){
                ball.x = ball.r;
                balls.splice(i,1);
            }

            if(ball.x + ball.r > w){
                ball.x = h - ball.r;
                balls.splice(i,1);
            }

            if(ball.y - ball.r < 0){
                ball.y = ball.r;
                balls.splice(i,1);
            }

            if(ball.y + ball.r > h){
                ball.x = ball.r;
                balls.splice(i,1);
            }
        }

        

        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0,0,w,h);
            if(isMoveing){
                balls.forEach(moveBall);         
            }
            
            balls.forEach(drawBall);
        }());

    }()];

