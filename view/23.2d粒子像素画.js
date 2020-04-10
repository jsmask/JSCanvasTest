import Ball from '../src/ball';
import { rp, randomColor, loadImg } from '../src/untils'
import jg0 from '../public/images/jiegeng0.jpg'
import jg1 from '../public/images/jiegeng1.jpg'

    ;[function () {
        const app = document.getElementById("app");
        const canvas = document.createElement("canvas");
        let w = canvas.width = 800;
        let h = canvas.height = 600;
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

        window.onresize = function () {
            app.style.width = document.body.clientWidth + "px";
            app.style.height = document.body.clientHeight + "px";
        }

        let balls = [], g = 0.2, isMoveing = false, progress = 0, activeIndex = 0;

        function initCanvas() {
            drawPic(jg0, 0)
                .then(() => drawPic(jg1, 1));
        }
        initCanvas();

        function drawPic(src, index) {
            return new Promise((resolve, reject) => {
                ctx.save();
                ctx.clearRect(0, 0, w, h);
                loadImg(src).then(img => {
                    ctx.drawImage(img, 0, 0, w, h);

                    checkPX().then(b => {
                        ctx.clearRect(0, 0, w, h);
                        balls[index] = b;
                        balls[index].forEach(drawBall);
                        resolve();
                    });
                });
                ctx.restore();
            })
        }

        function checkPX() {
            let b = [];
            return new Promise((resolve, reject) => {
                for (let y = 0; y < h + 5; y += 8) {
                    for (let x = 0; x < w + 5; x += 8) {
                        let imageData = ctx.getImageData(x, y, 1, 1);
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

        function createBall() {
            return new Ball({
                vx: rp([-10, 10]),
                vy: rp([-10, 10]),
                r: rp([5, 7]),
                x: rp([-2 * w, 2 * w]),
                y: rp([-2 * h, 2 * h]),
                alpha: rp([7, 10]) / 10
            })
        }

        function drawBall(ball) {
            let dx = ball.targetX - ball.x;
            let dy = ball.targetY - ball.y;
            ball.x += dx * 0.05;
            ball.y += dy * 0.05;
            if (Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08) {
                progress++;
            }
            if (progress >= balls[activeIndex].length) {
                isMoveing = true;
                progress = 0;
            }
        }

        function renderBall(ball) {
            ball.render(ctx);
        }

        function moveBall(ball, i) {
            if (progress >= balls[activeIndex].length) {
                    ball.vy += g;
                    ball.x += ball.vx;
                    ball.y += ball.vy;

                if (ball.x - ball.r < 0) {
                    ball.x = ball.r;
                    balls[activeIndex].splice(i, 1);
                }

                if (ball.x + ball.r > w) {
                    ball.x = h - ball.r;
                    balls[activeIndex].splice(i, 1);
                }

                if (ball.y - ball.r < 0) {
                    ball.y = ball.r;
                    balls[activeIndex].splice(i, 1);
                }

                if (ball.y + ball.r > h) {
                    ball.x = ball.r;
                    balls[activeIndex].splice(i, 1);
                }

            }
            else {
                let arr = ball.fillStyle.substring(4, ball.fillStyle.length - 1).split(",");
                let target = balls[1][i].fillStyle.substring(4, balls[1][i].fillStyle.length - 1).split(",");
                let r = ~~arr[0];
                let g = ~~arr[1];
                let b = ~~arr[2];

                let dr = ~~target[0] - arr[0];
                let dg = ~~target[1] - arr[1];
                let db = ~~target[2] - arr[2];

                let swing = 0.05;

                if (dr == 0) {
                    r = ~~target[0];
                } else {
                    let v = dr > 0 ? 1 : -1;
                    r += Math.abs(dr * swing) < 1 ? v : ~~(dr * swing);
                    // r += v;
                    r = Math.floor(Math.min(255, Math.max(r, 0)));
                }


                if (dg == 0) {
                    g = ~~target[1];
                }
                else {
                    let v = dg > 0 ? 1 : -1;
                    g += Math.abs(dg * swing) < 1 ? v : ~~(dg * swing);
                    //g += v;
                    g = Math.floor(Math.min(255, Math.max(g, 0)));
                }

                if (db == 0) {
                    b = ~~target[2];
                } else {
                    let v = db > 0 ? 1 : -1;
                    b += Math.abs(db * swing) < 1 ? v : ~~(db * swing);
                    //b += v;
                    b = Math.floor(Math.min(255, Math.max(b, 0)));
                }
                ball.fillStyle = `rgb(${r},${g},${b})`;

                if (!ball.isTarget && dr == 0 && dg == 0 && db == 0) {
                    progress++;
                    ball.isTarget = true;
                }
            }



        }


        function drawBlackBg(alpha){
            ctx.save();
            ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
        }
        drawBlackBg(1)


        ; (function run() {
            window.requestAnimationFrame(run);
            //ctx.clearRect(0, 0, w, h);
            drawBlackBg(.8)
            if (balls.length > 0 && balls[activeIndex].length > 0) {
                if (isMoveing) {
                    balls[activeIndex].forEach(moveBall);
                }
                else {
                    balls[activeIndex].forEach(drawBall);
                }
                balls[activeIndex].forEach(renderBall);
            }
        }());

    }()];

