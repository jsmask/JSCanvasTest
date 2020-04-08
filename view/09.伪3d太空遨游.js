import Ball from '../src/ball';
import { rp,randomColor } from '../src/untils'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let ctx = canvas.getContext("2d");

        canvas.style.backgroundColor = "#000";
        app.append(canvas);

        let balls = [], num = 500, f = 0.8, maxZ = 2500;
        let f1 = 200, hx = w / 2, hy = h / 2;

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            hx = w / 2;
            hy = h / 2;
        });

        let ballSkin = ctx.createRadialGradient(0, 0, 0, 0, 0, 28);
        


        function createBox() {
            balls.length=0;
            ballSkin.addColorStop(0, "#fff");
            ballSkin.addColorStop(0.3, "rgba(0, 255, 240, 1)");
            ballSkin.addColorStop(0.5, randomColor());
            ballSkin.addColorStop(1, "rgba(0,0,0,0.5)");
            for (let i = 0; i < num; i++) {
                balls.push(
                    new Ball({
                        x3d:rp([-1.5*w,2*w]),
                        y3d:rp([-1.5*h,2*h]),
                        z3d:rp([0,maxZ]),
                        fillStyle: ballSkin,
                        r:28,
                        vz:rp([-2,2]),
                        az:rp([-5,-1])
                    })
                )
            }
        }

        createBox();

        function moveBall(ball){
            ball.vz += ball.az;
            ball.vz*=f;
            ball.z3d += ball.vz;

            if(ball.z3d<-f1){
                ball.z3d += maxZ;
            }
            
            if(ball.z3d > maxZ - f1){
                ball.z3d -= maxZ;
            }

            let scale = f1 / (f1+ball.z3d);
            ball.scaleX = ball.scaleY = scale;
            ball.x = hx + ball.x3d*scale;
            ball.y = hy + ball.y3d*scale;
            ball.alpha = Math.min(Math.abs(scale)*2, 1);
        }

        function drawBall(ball){
            ball.render(ctx);
        }

        function zSort(a, b) {
            return b.z3d - a.z3d;
        }

        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0, 0, w, h);

            balls.forEach(moveBall);
            balls.sort(zSort);
            balls.forEach(drawBall);
        }());


        canvas.addEventListener("mousedown",e=>{
            createBox();
        })



    }()];


