import Ball from '../src/ball';
import { rp, checkBallHit } from '../src/untils'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let ctx = canvas.getContext("2d");

        canvas.style.backgroundColor = "#000";
        app.append(canvas);

        let balls = [], num = 200;

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        function createBox() {
            balls.length = 0;  
            for (let i = 0; i < num; i++) {
                let r = rp([3,10]);
                balls.push(
                    new Ball({
                        x: rp([0, w]),
                        y: rp([0, h]),
                        fillStyle: "#fff",
                        r,
                        // vx: rp([-2, 2]),
                        // vy: rp([-2, 2]),
                        m:r
                    })
                )
            }
        }

        createBox();

        function moveBall(ball, i) {
            ball.x += ball.vx;
            ball.y += ball.vy;

            for (let j = i + 1; j < balls.length; j++) {
                let target = balls[j];
                gravitate(ball,target);
                checkBallHit(ball,target);
            }
            // if (ball.x + ball.r > w) {
            //     ball.x = w - ball.r;
            //     ball.vx *= -1;
            // }
            // if (ball.x - ball.r < 0) {
            //     ball.x = ball.r;
            //     ball.vx *= -1;
            // }
            // if (ball.y + ball.r > h) {
            //     ball.y = h - ball.r;
            //     ball.vy *= -1;
            // }
            // if (ball.y - ball.r < 0) {
            //     ball.y = ball.r;
            //     ball.vy *= -1;
            // }
        }

        function gravitate(ballA,ballB){
            
                let dx = ballB.x - ballA.x;
                let dy = ballB.y - ballA.y;
                let direction = Math.sqrt(dx ** 2 + dy ** 2);
                let f = ballA.m * ballB.m / (direction**2);
                let ax = f * dx / direction;
                let ay = f * dy / direction;

                ballA.vx += ax / ballA.m;
                ballA.vy += ay / ballA.m;
                ballB.vx -= ax / ballB.m;
                ballB.vy -= ay / ballB.m;
            
        }

        function drawBall(ball) {
            ball.render(ctx);
        }

        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0, 0, w, h);

            balls.forEach(moveBall);
            balls.forEach(drawBall);
        }());


        canvas.addEventListener("mousedown", e => {
            createBox();
        })



    }()];


