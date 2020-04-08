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

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        let balls = [], num = 300, g = 0.2, bounce = -0.8, floor = 300;
        let f1 = 200, hx = w / 2, hy = h / 2;

        let ballSkin = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);        
        function createBox() {
            ballSkin.addColorStop(0, randomColor());
            ballSkin.addColorStop(0.3, randomColor());
            ballSkin.addColorStop(1, randomColor());
            for (let i = 0; i < num; i++) {
                balls.push(
                    new Ball({
                        vx: rp([-6, 6]),
                        vy: rp([-3, -6]),
                        vz: rp([-5, 5]),
                        y3d: -200,
                        fillStyle: ballSkin,
                        r: 8
                    })
                )
            }
        }

        createBox();

        function moveBall(ball) {
            ball.vy += g;
            ball.x3d += ball.vx;
            ball.y3d += ball.vy;
            ball.z3d += ball.vz;

            if(ball.y3d > floor){
                ball.y3d = floor;
                ball.vy *= bounce;
              }

            if (ball.z3d > -f1) {
                let scale = f1 / (f1 + ball.z3d);
                ball.scaleX = ball.scaleY = scale;
                ball.x = hx + ball.x3d * scale;
                ball.y = hy + ball.y3d * scale;
                ball.show = true;
            }
            else {
                ball.show = false;
            }
        }

        function drawBall(ball) {
            ball.show && ball.render(ctx);
        }

        function zSort(a, b) {
            return b.z3d - a.z3d;
        }

        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0, 0, w, h);
            playBall();
        }());

        function playBall(){
            balls.forEach(moveBall);
            balls.sort(zSort);
            balls.forEach(drawBall);
        }

        canvas.addEventListener("mousedown",e=>{
            hx = e.offsetX;
            hy = e.offsetY+200;
            balls.length = 0;

            createBox();
        })



    }()];


