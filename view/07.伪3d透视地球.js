import Ball from '../src/ball';
import img_ball from '../public/images/ball3.png'

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

        let fl = 100;
        let isMove = false;
        let dx = 0, dy = 0;

        let ball = new Ball({
            x: w / 2,
            y: h / 2,
            z: 0,
            r: 100,
            src: img_ball
        }).render(ctx);

        (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0, 0, w, h);

            if (ball.z > -fl) {
                ball.show = true;
                ball.scaleX = ball.scaleY = fl / (fl + ball.z);
            }
            else {
                ball.show = false;
            }
            ball.show && ball.render(ctx);
        }());

        canvas.addEventListener("wheel", e => {
            ball.z += e.deltaY * 0.05;
        });

        canvas.addEventListener("mousedown", e => {
            dx = e.offsetX - ball.x;
            dy = e.offsetY - ball.y;
            if (Math.sqrt(dx ** 2 + dy ** 2) <= ball.r * ball.scaleX) {   
                isMove = true;
            }
        });

        canvas.addEventListener("mousemove", e => {
            if (!isMove) return;
            ball.x = e.offsetX - dx;
            ball.y = e.offsetY - dy;
        });

        canvas.addEventListener("mouseup", e => {
            isMove = false;
        })


    }()];


