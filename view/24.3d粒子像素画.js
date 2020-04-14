import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp,randomColor,loadImg } from "../src/untils";
import jg0 from '../public/images/jiegeng0.jpg'

window.addEventListener("load", init);


function imgData(src){
    const app = document.getElementById("app");
    const canvas = document.createElement("canvas");
    let w = canvas.width = 200;
    let h = canvas.height = 150;
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
    canvas.style.display = "none";
    app.append(canvas);

    window.onresize = function () {
        app.style.width = document.body.clientWidth + "px";
        app.style.height = document.body.clientHeight + "px";
    }

    function drawPic() {
        return new Promise((resolve, reject) => {
            ctx.save();
            ctx.clearRect(0, 0, w, h);
            loadImg(src).then(img => {
                ctx.drawImage(img, 0, 0, w, h);
                checkPX().then(b => {
                    ctx.clearRect(0, 0, w, h);
                    resolve(b);
                });
            });
            ctx.restore();
        })
    }

    
    function checkPX() {
        let b = [];
        return new Promise((resolve, reject) => {
            for (let y = 0; y < h; y += 2) {
                for (let x = 0; x < w; x += 2) {
                    let imageData = ctx.getImageData(x, y, 1, 1);
                    b.push({
                        x,
                        y,
                        color:`rgb(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]})`
                    })
                }
            }
            resolve(b);
        });
    }
    
    return drawPic();
}


function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    camera.position.set(-150, 0, 270);
    camera.lookAt(scene.position);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
    window.dispatchEvent(new Event("resize"));

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;
    app.append(renderer.domElement);


    let group = new THREE.Group();
    group.rotation.x = -1 * Math.PI;

    let geom = new THREE.Geometry();  
    let material = new THREE.PointsMaterial({
        size:3.6,
        vertexColors:true,
        color:0xffffff
    });
    let type = 1;

    let arr = [];
    imgData(jg0).then(data=>{
        console.time();
        data.forEach((item,index)=>{
            if(type==0){
                // Sprite 粒子
                createSprite(item,index);
            }
            else{
                // Points 粒子
                createSpriteX(item,index)
            }
        })
        
        if(type == 1){
            let box = new THREE.Points(geom,material);
            group.add(box);
        }

        console.timeEnd();
        
    })

    function createSprite(item,index){
        type = 0;
        let sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            color:new THREE.Color(item.color)
        }));
        sprite.scale.set(1.8,1.8,10);
        arr[index] = {
            x:item.x-100,
            y:item.y-75,
            z:0,
            complate:false
        }
        sprite.position.set(rp([-1000,1000]),rp([-1000,1000]),rp([-1000,1000]));
        group.add(sprite);
    }

    function createSpriteX(item,index){
        type = 1  
        let v3 = new THREE.Vector3(rp([-1000,1000]),rp([-1000,1000]),rp([-1000,1000])); 
        geom.vertices.push(v3);
        geom.colors.push(new THREE.Color(item.color));
        arr[index] = {
            x:item.x-100,
            y:item.y-75,
            z:0,
            complate:false
        }
    }

    scene.add(group);

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    //let stats = initStats();

    // let controls = new DatControls();
    // let gui = new dat.GUI();


    let step = 0,is_rotation=false,progress = 0,dt = 0;

    function move(mesh,i){
        if(mesh instanceof THREE.Points){
            mesh.geometry.vertices.forEach(move);
            mesh.geometry.verticesNeedUpdate = true;
            return;
        }
        let tx = 0,ty = 0,tz = 0;
        if(mesh instanceof THREE.Vector3){
            tx = mesh.x;
            ty = mesh.y;
            tz = mesh.z;
        }else{
            tx = mesh.position.x;
            ty = mesh.position.y;
            tz = mesh.position.z;
        }

        let dx =  arr[i].x - tx;
        let dy = arr[i].y - ty;
        let dz = arr[i].z - tz;
        let swing = 0.025;

        if(dx<0.01&&dx>-0.01 && dy<0.01&&dy>-0.01 && dz<0.01&&dz>-0.01 && !arr[i].complate){
            arr[i].complate = true;
            progress ++;
            if(progress>= arr.length){
                is_rotation = true;
            }
        }

        if(mesh instanceof THREE.Vector3){
            mesh.x += dx *swing;
            mesh.y += dy *swing;
            mesh.z += dz *swing;
        }
        else{
            mesh.position.x += dx *swing;
            mesh.position.y += dy *swing;
            mesh.position.z += dz *swing;
        }
        
    }

    let angle = 0;
    ; (function run() {
        // trackballControls.update(clock.getDelta());
        // stats.update();

        dt++;

        if(dt>100){
            dt = 100;
            group.children.forEach(move);
        }
        else{
            step +=0.003;
        }
        
        if(is_rotation){
            trackballControls.update(clock.getDelta());
            // angle+=0.01;
            // camera.position.z = 270 + 100*Math.sin(angle);
            // camera.position.x = -150 + 50*Math.cos(angle)
        }
        group.rotation.y = step;
        
        
        requestAnimationFrame(run);
        renderer.render(scene, camera);
    })();

    function initStats(type = 0) {
        let stats = new Stats();
        stats.showPanel(type);
        document.body.append(stats.dom);
        return stats;
    }

    function initTrackballControls(camera, renderer) {
        let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.2;
        trackballControls.panSpeed = 0.8;
        trackballControls.noZoom = false;
        trackballControls.noPan = false;
        trackballControls.staticMoving = true;
        trackballControls.dynamicDampingFactor = 0.3;
        trackballControls.keys = [65, 83, 68];
        return trackballControls;
    }

}
