import Ball from '../src/ball';
import Bg from '../src/bg';
import Land from '../src/land';
import img_bg from '../public/images/bg3.png';
import img_land from '../public/images/land1.png';
import img_ball from '../public/images/ball2.png';

;[function () {
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = 800;
    let h = canvas.height = 600;

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

    window.addEventListener("resize", () => {
        app.style.width = document.body.clientWidth + "px";
        app.style.height = document.body.clientHeight + "px";
    });

    let offsetX, offsetY;



    const ctx = canvas.getContext("2d");

    let bg = new Bg({ ctx });
    let land = new Land({
        ctx,
        src: img_land
    }).render();

    let ball = new Ball({
        vx: 0,
        vy: 0,
        x: 100,
        y: h / 2,
        fillStyle: "#6140de",
        r: 20,
        angle: 0,
        src: img_ball
    }).render(ctx);

    let isSend = false, g = 0.3;

    ; (function run() {
        window.requestAnimationFrame(run);
        ctx.clearRect(0, 0, w, h);
        bg.draw(img_bg);
        land.draw();

        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y + ball.r >= h - land.height) {
            ball.y = h - land.height - ball.r;
            if (ball.vx > 0.1) {
                ball.vx -= 0.1;
                ball.angle += 0.1;
                ball.alpha -=0.01;
            }
            else if (ball.vx < -0.1) {
                ball.vx += 0.1;
                ball.angle -= 0.1;
                ball.alpha -=0.01;
            }
            else {
                if(isSend) stgaeInit();
            }
        }
        if (ball.y + ball.r < 0) {
            ball.y = ball.r;
            ball.vy *= -0.8;
        }
        if (ball.x - ball.r < 0) {
            ball.x = ball.r;
            ball.vx *= -0.5;
            ball.angle *= -1;
        }
        if (ball.x + ball.r > w) {
            ball.x = w - ball.r;
            ball.vx *= -0.5;
            ball.angle *= -1;
        }


        ball.render(ctx);

        drawLine();

        if(isSend) ball.vy += g;

    }());

    function stgaeInit() {
        isSend = false;
        ball.x = 100;
        ball.vy = 0;
        ball.y = h / 2;
        ball.vx = 0;
        ball.alpha = 1;
    }


    function drawLine() {

        if (isSend) return;
        let dx = offsetX - ball.x;
        let dy = offsetY - ball.y;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;

        if (!angle) return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.lineCap = "round";
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }


    canvas.addEventListener("mousemove", e => {
        if (isSend) return;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    canvas.addEventListener("mousedown", e => {
        if (isSend) return;
        isSend = true;
        onSend(e.offsetX, e.offsetY);
    });

    function onSend(x, y) {
        let speed = 5;
        let swing = 0.01;
        let dx = x - ball.x;
        let dy = y - ball.y;
        ball.vx = speed * dx * swing;
        ball.vy = speed * dy * swing;
    }

}()];


