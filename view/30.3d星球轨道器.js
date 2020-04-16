import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
import ball_color from "../public/images/3d/mars/mars_1k_color.jpg" 
import ball_normal from "../public/images/3d/mars/mars_1k_normal.jpg"
require("three/examples/js/controls/OrbitControls")


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    let dirLight= new THREE.DirectionalLight(0xFFFFFF,2);
    dirLight.position.set(50, 10, 0);
    scene.add(dirLight);

    camera.position.set(0, 0, 80);
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


    let ball_color_texture = new THREE.TextureLoader().load(ball_color);
    let ball_normal_texture = new THREE.TextureLoader().load(ball_normal);
    let ball = new THREE.Mesh(new THREE.SphereGeometry(20,40,40),new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        map:ball_color_texture,
        normalMap:ball_normal_texture
    }));

    scene.add(ball);

    let orbitControls = new THREE.OrbitControls(camera,renderer.domElement);
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 3;
    let clock = new THREE.Clock();

    let stats = initStats();

    let DatControls = function(){};
    let controls = new DatControls();
    let gui = new dat.GUI();

    ; (function run() {
        orbitControls.update(clock.getDelta());
        stats.update();

        requestAnimationFrame(run);
        renderer.render(scene, camera);
    })();

    function initStats(type = 0) {
        let stats = new Stats();
        stats.showPanel(type);
        document.body.append(stats.dom);
        return stats;
    }

}
