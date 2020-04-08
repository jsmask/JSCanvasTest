
import Bg from '@src/bg';
import Fish from '@src/fish';
import img_bg from "@images/bg2.png";
import img_fish from '@images/sea.png';
import img_fish0 from '@images/fish0.png';
import img_fish1 from '@images/fish1.png';
import img_fish2 from '@images/fish2.png';
import img_fish3 from '@images/fish3.png';
import img_fish4 from '@images/fish4.png';
import img_fish5 from '@images/fish5.png';

;[function () {
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    app.append(canvas);
    let bg = new Bg({ ctx, scale: 2 });
    let fish = null;
    let hero = new Fish({
        x:w/2,
        y:h/2,
        src:img_fish,
        rows:[1,10],
        mh:6,
        speed:4,
        scale:1
    }).render(ctx);

    const fishPool = [];
    const num = 20;

    const fishType = [{
        name: "红鱼",
        src: img_fish0,
        rows: [1, 8],
        mh: 4,
        speed: 2.5,
        swing: 35
    }, {
        name: "魔鬼鱼",
        src: img_fish1,
        rows: [1, 12],
        mh: 8,
        speed: 4,
        swing: 50
    }, {
        name: "小丑鱼",
        src: img_fish2,
        rows: [1, 8],
        mh: 4,
        speed: 3.5,
        swing: 20
    }, {
        name: "安康鱼",
        src: img_fish3,
        rows: [1, 12],
        mh: 8,
        speed: 1.5,
        swing: 10
    }, {
        name: "蓝鱼",
        src: img_fish4,
        rows: [1, 8],
        mh: 4,
        speed: 3.5,
        swing: 15
    }, {
        name: "鲨鱼",
        src: img_fish5,
        rows: [1, 12],
        mh: 8,
        speed: 2,
        swing: 5
    }];

    function createFish() {
        let fish = fishType[~~(Math.random() * fishType.length)];
        return Object.assign({
            x: -200,
            y: h * Math.random(),
            angle: 0,
            scale: 1 + (Math.random()>0.5?-0.2:0.2)
        }, fish);
    }

    function addFish() {
        let fish = createFish();
        fish.py = fish.y;
        fish.speed += Math.random()*0.5;
        fishPool.push(new Fish(fish).render(ctx));
    }

    // fish = new Fish({
    //     x:0,
    //     y:h/2,
    //     src:img_fish1,
    //     rows:[1,12],
    //     mh:8,
    //     speed:3,
    //     swing:50,
    //     angle:0,
    //     scale:1
    // }).render(ctx);

    let dt = 0;
    let offsetX=w/2;
    let offsetY=h/2;



    ; (function run() {
        window.requestAnimationFrame(run);
        ctx.clearRect(0,0,w,h);
        bg.draw(img_bg);
        drawFishPool(dt);
        drawHero(dt);
        dt++;
    }());

    function drawFishPool(dt) {
        if (dt % 100 == 0 && fishPool.length < num) {
            addFish();
        }
        fishPool.forEach(fish => {
            fish.x += fish.speed;
            fish.y = fish.py + Math.sin(fish.angle) * fish.swing;
            fish.angle += 0.03;
            fish.angle %= Math.PI * 2;
            fish.updated(dt);
            if (fish.x > w + fish.w) {
                fish.x = -fish.w;
            }
        });
    }

    function drawHero(dt) {
        let dx = offsetX - hero.x;
        let dy = offsetY - hero.y;
        hero.angle = Math.atan2(dy,dx);
        
        if((dx<5&&dx>-5)&&(dy<5&&dy>-5)){

        }else{
            hero.x += hero.speed*Math.cos(hero.angle);
            hero.y += hero.speed*Math.sin(hero.angle);
        }
        
        hero.rotation =hero.angle;
        hero.updated(dt);
    }

    canvas.addEventListener("mousemove",e=>{
        offsetX=e.offsetX;
        offsetY=e.offsetY;
    })

    // canvas.addEventListener("mouseup",e=>{
    //     offsetX=e.offsetX;
    //     offsetY=e.offsetY;
    //     console.log(offsetX,offsetY);
    //     console.log(fish.x,fish.y);
    // })




}()];