import Rain from '@src/rain';

;[function () {
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    app.append(canvas);

    function drawBg(){
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,.1)"
        ctx.fillRect(0, 0, w, h);
        ctx.closePath();
    }

    const rainList = [];
    const num =80;

    let dt = 0;
    ; (function move() {
        window.requestAnimationFrame(move);
        drawBg();
        dt++;
        if(dt>=20&&rainList.length<num){
            dt%=20;
            rainList.push(new Rain({ctx,w,h}));
        }
        rainList.forEach(rain=>{
            rain.draw();
        });    
    }());

}()];