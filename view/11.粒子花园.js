import Ball from '../src/ball';
import { rp, checkBallHit,randomColor } from '../src/untils'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let ctx = canvas.getContext("2d");

        canvas.style.backgroundColor = "#000";
        app.append(canvas);

        let balls = [], num = 100,spring=0.0002,color="#fff";

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            num = w * h /15000;
            createBox();
        });

        window.dispatchEvent(new Event("resize"));

        function createBox() {
            balls.length = 0;
            for (let i = 0; i < num; i++) {
                let size =rp([5,10]);
                balls.push(
                    new Ball({
                        x: rp([0, w]),
                        y: rp([0, h]),
                        fillStyle: color,
                        r:size,
                        m:size,
                        vx: rp([-2, 2]),
                        vy: rp([-2, 2])
                    })
                )
            }
        }

        function moveBall(ball, i) {
            ball.x += ball.vx;
            ball.y += ball.vy;

            for (let j = i + 1; j < balls.length; j++) {
                let target = balls[j];
                checkSpring(ball, target);
                checkBallHit(ball,target);
            }

            if (ball.x - ball.r > w) {
                ball.x = - ball.r;
            }
            if (ball.x + ball.r < 0) {
                ball.x = w + ball.r;
            }
            if (ball.y - ball.r > h) {
                ball.y = - ball.r;
            }
            if (ball.y + ball.r < 0) {
                ball.y = h+ball.r;
            }
        }

        function checkSpring(ballA, ballB) {
            let dx = ballB.x - ballA.x;
            let dy = ballB.y - ballA.y;
            let dist = Math.sqrt(dx**2+dy**2);
            let minLen = Math.max(w * 0.1,h*0.18);
            if(dist<minLen){
                drawLine(ballA,ballB,dist,minLen);
                let ax = dx * spring;
                let ay = dy * spring;
                ballA.vx += ax / ballA.m;
                ballA.vy += ay / ballA.m;
                ballB.vx -= ax / ballB.m;
                ballB.vy -= ay / ballB.m;
            }
        }

        function drawLine(ballA,ballB,dist,minLen){
            ctx.save();
            ctx.lineWidth = 3 * Math.max(0,1-dist/minLen);
            ctx.globalAlpha = Math.max(0,1-dist/minLen)
            ctx.strokeStyle =color;
            ctx.beginPath();
            ctx.lineTo(ballA.x,ballA.y);
            ctx.lineTo(ballB.x,ballB.y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
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
            color = randomColor();
            createBox();
        })



    }()];


