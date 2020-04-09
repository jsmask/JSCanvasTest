import Ball from '../src/ball';
import { rp, randomColor,loadImg } from '../src/untils'
import jg0 from '../public/images/jiegeng0.jpg'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = 900;
        let h = canvas.height = 640;
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
      
        app.append(canvas);

        window.onresize=function(){
            app.style.width = document.body.clientWidth + "px";
            app.style.height = document.body.clientHeight + "px";
        }

        let balls = [],g=0.2,isMoveing=false,progress=0;

        function drawPic(){
            ctx.save();
            loadImg(jg0).then(img=>{
                ctx.drawImage(img,0,0,w,h);
                checkPX().then( b =>{
                    ctx.clearRect(0,0,w,h);
                    balls = b;
                    balls.forEach(drawBall); 
                });
            });
            ctx.restore();
        }

        

        function checkPX(){
            let b = [];
            return new Promise((resolve,reject)=>{
                for (let y = 0; y < h+5; y+=12) {
                    for (let x = 0; x < w+5; x+=12) {
                        let imageData = ctx.getImageData(x,y,1,1);
                        let ball = createBall();
                        ball.fillStyle = `rgb(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]})`;
                        ball.targetX = x;
                        ball.targetY = y;
                        b.push(ball);
                    }     
                }
                resolve(b);
            });
        }

        function createBall(){         
            return new Ball({
                vx:rp([-15,15]),
                vy:rp([-15,15]),
                r:rp([6,9]),
                x:rp([-1.5*w,1.5*w]),
                y:rp([-1.5*h,1.5*h]),
                alpha:rp([7,10])/10
            })
        }

        function drawBall(ball){
            let dx = ball.targetX - ball.x;
            let dy = ball.targetY - ball.y;
            ball.x += dx * 0.1;
            ball.y += dy * 0.1;
            if(Math.abs(dx)<0.08&&Math.abs(dy)<0.08){
                progress++;
            }
            if(progress>=balls.length){
                isMoveing = true;
            }
        }

        function renderBall(ball){
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

        drawPic()

        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0,0,w,h);
            if(balls.length>0){
                if(isMoveing){
                    balls.forEach(moveBall);         
                }
                else{
                    balls.forEach(drawBall);
                }
                balls.forEach(renderBall);
            }
        }());

    }()];

