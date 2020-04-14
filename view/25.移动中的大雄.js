import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
import dx from '../public/images/daxiong.png'
import jx from '../public/images/jingxiang.png'
import xf from '../public/images/xiaofu.png'
import ph from '../public/images/panghu.png'
import jqm from '../public/images/dlam.png'

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let sceneOrtho = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    let cameraOrtho = new THREE.OrthographicCamera(-10, 10,10, -10, -10, 10);

    camera.position.set(0, 0, 10);
    camera.lookAt(scene.position);
    
    cameraOrtho.position.set(0,0,0);
    cameraOrtho.lookAt(sceneOrtho.position);

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

    let daxiong_texture = new THREE.TextureLoader().load(dx);
    let jingxiang_texture = new THREE.TextureLoader().load(jx);
    let xiaofu_texture = new THREE.TextureLoader().load(xf);
    let panghu_texture = new THREE.TextureLoader().load(ph);
    let dlam_texture = new THREE.TextureLoader().load(jqm);

    let ball = new THREE.Mesh(new THREE.SphereGeometry(0.1,20,20),new THREE.MeshNormalMaterial());

    function createRole(texture, x, y, type = 1,speed = .35) {
        let matalial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1,
            color: 0xFFFFFF
        });
        matalial.map.offset = new THREE.Vector2(1 / 4, 1 - 1 / 4);
        matalial.map.repeat = new THREE.Vector2(1 / 4, 1 / 4);
        matalial.blending = THREE.AdditiveBlending;
        matalial.depthTest = false;
        let sprite = new THREE.Sprite(matalial);
        sprite.position.set(x,y,0);
        sprite.scale.set(1, 1.7, 1);
        sprite.type = type;
        sprite.speed = speed;
        // 4 上 1下 3右 2左
        switch (type) {
            case 1: sprite.vy = sprite.vx = -1*sprite.speed;
                break;
            case 2: sprite.vy = -1*sprite.speed;  
                    sprite.vx = 1*sprite.speed;
                break;
            case 3: sprite.vy = 1*sprite.speed;
                    sprite.vx = -1*sprite.speed;
                break;
            case 4: sprite.vy = sprite.vx = 1*sprite.speed;
                break;
            default:
                break;
        }
        sprite.step = 0;
        return sprite;
    }


    let daxiong = createRole(daxiong_texture, -3, 2, 1);
    let jingxiang = createRole(jingxiang_texture, -3, 0.5, 1);
    let xiaofu = createRole(xiaofu_texture, 0, 3, 2);
    let panghu= createRole(panghu_texture,-1.5,3,2);
    let dlam = createRole(dlam_texture,-3,-3,3);

    scene.add(ball);

    sceneOrtho.add(daxiong);
    sceneOrtho.add(jingxiang);
    sceneOrtho.add(xiaofu);
    sceneOrtho.add(panghu);
    sceneOrtho.add(dlam);

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    // let controls = new DatControls();
    //let gui = new dat.GUI();


    let dt = 0;


    ; (function run() {
        trackballControls.update(clock.getDelta());
        stats.update();

        dt++;

        camera.position.x = 6 * Math.cos(dt/10);
        camera.position.y = 6 * Math.sin(dt/10);

        sceneOrtho.traverse(mesh => {
            if (mesh instanceof THREE.Sprite) {

                if (dt % 8 == 0) {
                    mesh.step++;
                    mesh.step %= 4;
                    mesh.material.map.offset.set(mesh.step / 4, 1 - mesh.type / 4);
                    if (mesh.type == 4 || mesh.type == 1) {
                        mesh.position.y += mesh.vy;
                    }
                    else {
                        mesh.position.x -= mesh.vx;
                    }

                    if (mesh.position.y < -3 && mesh.type == 1) {
                        mesh.position.y = -3;
                        mesh.type = 3;
                        mesh.vy *= -1;
                    }
                    else if (mesh.position.x > 3 && mesh.type == 3) {
                        mesh.position.x = 3;
                        mesh.type = 4;
                        mesh.vx *= -1;
                    }
                    else if (mesh.position.y > 3 && mesh.type == 4) {
                        mesh.position.y = 3;
                        mesh.type = 2;
                        mesh.vy *= -1;
                    }
                    else if (mesh.position.x < -3 && mesh.type == 2) {
                        mesh.position.x = -3;
                        mesh.type = 1;
                        mesh.vx *= -1;
                    }
                }
            }
        })

        requestAnimationFrame(run);
        renderer.render(scene, camera);
        renderer.autoClear = false;
        renderer.render(sceneOrtho, cameraOrtho);
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
