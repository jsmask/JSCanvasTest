
import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import roughness_map from "../public/images/3d/engraved/roughness-map.jpg"
import wood_skin from '../public/images/3d/general/wood-2.jpg';

require("../public/src/physi");

const Physijs = window.Physijs;
// Physijs.scripts.worker
// Physijs.scripts.ammo

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new Physijs.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    renderer.autoClear = false;

    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xcFcF56, 1);
    spotLight.position.set(-50, 120, 90)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    scene.add(spotLight);

    // let lightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(lightHelper);


    camera.position.set(20, 15, 15);
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


    function createWood() {
        let loader = new THREE.TextureLoader();
        let map = loader.load(wood_skin);
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            map,
        }), .3, .8);
        let geometry = new THREE.BoxGeometry(2,2,200);
        let wood = new Physijs.BoxMesh(geometry, material, 0);
        wood.position.set(0,0,0);
        wood.receiveShadow = true;
        wood.castShadow = true;

        scene.add(wood);
    }

    var balls = [],ballsConstraint = [];

    function ceatePointBalls(){
        let colors = ["#2d85f0", "#f4433c", "#ffbc32", "#0aa858"];
        let count = 24;
        let r = 0.5;
        let geometry = new THREE.SphereGeometry(r,10,10);

        for (let i = 0; i < count; i++) {
            let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
                color:new THREE.Color(colors[i%colors.length]),
                roughnessMap:new THREE.TextureLoader().load(roughness_map),
                metalness:.3,
                roughness:.6
            }),0,0);
            let ball = new Physijs.SphereMesh(geometry,material);
            ball.position.y = 10;
            ball.position.x = i*r*2 - count*r;
            ball.position.z = 0;           
            scene.add(ball);
            if (i != 0) {
                let ballConstraint = new Physijs.PointConstraint(balls[i-1], ball, ball.position);
                scene.addConstraint(ballConstraint);
                ballsConstraint.push(ballConstraint);
            }
            ball.castShadow = true;
            ball.receiveShadow = true;
            balls.push(ball); 
        }
    }


    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();

    let DatControls = function () {};
    DatControls.prototype.addPointBalls = function() {
        balls.forEach(ball=>scene.remove(ball));
        ballsConstraint.forEach(ball=>scene.removeConstraint(ball));
        balls.length = 0;
        ceatePointBalls();
    }

    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls ,"addPointBalls")

    scene.setGravity(new THREE.Vector3(0, -15, 0))
    createWood();
    ceatePointBalls();

    // 碰撞检测
    // mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {});

    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        requestAnimationFrame(run); 
        renderer.render(scene, camera);
        scene.simulate(undefined, 1);
    })();

    function initStats(type = 0) {
        let stats = new Stats();
        stats.showPanel(type);
        document.body.append(stats.dom);
        return stats;
    }

}