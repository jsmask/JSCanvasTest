import Ball from '../src/ball';
import { rp, randomColor } from '../src/untils'

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

        function drawTxt({ txt = "", x = 0, y = 0, color = "#333" }) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.font = `16px bolder 微软雅黑`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(txt, x, y);
            ctx.restore();
        }

        function drawHeartA() {
            let a = 72;
            ctx.save();
            ctx.fillStyle = "#f23232";
            ctx.translate(180, 150);
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            let r = 0, x = 0, y = 0;
            for (let i = -5; i < 360; i++) {
                r = a * (1 - Math.sin(i * Math.PI / 180));
                x = r * Math.cos(i * Math.PI / 180);
                y = r * Math.sin(i * Math.PI / 180);
                ctx.lineTo(x, y);
            }
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            drawTxt({
                txt: "笛卡尔心形曲线",
                x: 180,
                y: 335
            })
        }

        function drawHeartB() {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#f23232";
            ctx.translate(400, 220);
            ctx.rotate(Math.PI)
            let r = 0, a = 20, start = 0, end = 0;
            for (let i = 0; i < 1000; i++) {
                start += Math.PI * 2 / 1000;
                end = start + Math.PI * 2 / 1000;
                r = a * Math.sqrt(225 / (17 - 16 * Math.sin(start) * Math.sqrt(Math.cos(start) ** 2)));
                ctx.arc(0, 0, r, start, end, false);
            }
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            drawTxt({
                txt: "双椭圆心形",
                x: 400,
                y: 335
            })
        }

        function drawHeartC() {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "#f23232";
            
            ctx.translate(620, 200);
            ctx.scale(1,-1);
            ctx.moveTo(0,0);
            let angle=0,x=0,y=0,a=6;
            for (let i = 0; i < 30; i+=0.2) {
                angle = i / Math.PI;
                x = a * (16*Math.sin(angle)**3);
                y = a * (13*Math.cos(angle)-5*Math.cos(2*angle)-2*Math.cos(3*angle)-Math.cos(4*angle));
                ctx.lineTo(x,y);
            }
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            drawTxt({
                txt: "完美心形",
                x: 620,
                y: 335
            })
        }



        ; (function run() {
            window.requestAnimationFrame(run);
            ctx.clearRect(0,0,w,h);


            drawHeartA();
            drawHeartB();
            drawHeartC();

        }());

    }()];

