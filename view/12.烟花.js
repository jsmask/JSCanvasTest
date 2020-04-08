import Ball from '../src/ball';
import { rp, randomColor } from '../src/untils'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let ctx = canvas.getContext("2d");
        app.append(canvas);

        let balls = [], num = 30, dt = 0, g = 0.12;

        function addBall() {
            let ball = new Ball({boms: []});
            initBall(ball);
            balls.push(ball);
        }


        addBall();

        function moveBall(ball) {
            if (ball.status == "waiting") {
                ball.vy += g;
                ball.x += ball.vx;
                ball.y += ball.vy;
            }

            if (ball.vy >= -0.1 && ball.status == "waiting") {
                ball.alpha = 0;
                ball.status = "playing";
                createBoms(ball);
            }

            if (ball.status == "playing") {
                ball.boms.forEach((b, i) => moveBoms(b, i, ball));
                ball.boms.forEach(drawBall);
            }
        }

        function createBoms(ball) {
            ball.boms.length = 0;
            let n = 200;
            let angle = 360 / n;
            let fillStyle = randomColor();
            for (let i = 0; i < n; i++) {
                ball.boms.push(
                    new Ball({
                        x: ball.x,
                        y: ball.y,
                        fillStyle,
                        r:2,
                        // vx: 2*Math.cos(angle*i/180*Math.PI),
                        // vy: 2*Math.sin(angle*i/180*Math.PI),
                        vx:rp([-5,5]),
                        vy:rp([-5,5]),
                        minDist:rp([150,300])
                    })
                );
            };
        }

        function moveBoms(b, i, target) {
            b.vy += g/2;
            b.x += b.vx;
            b.y += b.vy;

            let dx = target.x - b.x;
            let dy = target.y - b.y;
            let dist = Math.sqrt(dx ** 2 + dy ** 2);
            
            if (dist < b.minDist) {
                b.alpha = Math.max(0, 1 - dist / b.minDist - 0.1);   
            } else {
                target.boms.splice(i, 1);
                if (target.boms.length == 0) {
                    initBall(target);
                }
            }
        }

        function initBall(target){
            target.x = w / 2;
            target.y = h;
            target.vx = rp([6, -6]);
            target.vy = rp([-9, -15]);
            target.status = "waiting";
            target.alpha = 1;
            target.r = 3;
            target.boms.length = 1;
            target.fillStyle="rgb(184,191,51)";
        }

        function drawBall(ball) {
            ball.render(ctx);
        }

        function drawBg() {
            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,.1)";
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
        }

        ; (function run() {
            window.requestAnimationFrame(run);
            drawBg();
            dt++;
            if (dt % 120 == 0 && balls.length < num) {
                addBall();
            }

            balls.forEach(moveBall);
            balls.forEach(drawBall);

        }());

    }()];

