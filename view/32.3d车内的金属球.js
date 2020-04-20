import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import right_map from "../public/images/3d/cubemap/car/right.png"
import left_map from "../public/images/3d/cubemap/car/left.png"
import top_map from "../public/images/3d/cubemap/car/top.png"
import bottom_map from "../public/images/3d/cubemap/car/bottom.png"
import front_map from "../public/images/3d/cubemap/car/front.png"
import back_map from "../public/images/3d/cubemap/car/back.png"

import roughness_map from "../public/images/3d/engraved/roughness-map.jpg"

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let cubeBox = new THREE.CubeTextureLoader().load([right_map,left_map,top_map,bottom_map,front_map,back_map]);
    // cubeBox.mapping = THREE.CubeRefractionMapping
    scene.background = cubeBox;

    let ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xFFFFFF, 0);
    dirLight.position.set(-200, 1000, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    let pointLight = new THREE.PointLight(0xd2d000,1,1000);
    let pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLight);
    scene.add(pointLightHelper);


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

    let watch_ball = new THREE.Mesh(new THREE.SphereGeometry(0.5,10,10),new THREE.MeshBasicMaterial({
        color:0xc2e070
    }));
    watch_ball.position.set(0,0,0);
    scene.add(watch_ball);

    let ball0 = new THREE.Mesh(new THREE.SphereGeometry(10,100,100),new THREE.MeshStandardMaterial({
        color: 0xffffff,
        envMap: scene.background,
        roughnessMap:new THREE.TextureLoader().load(roughness_map),
        metalness:1,
        roughness:0.2
    }));

    ball0.position.set(-20,0,0);

    let ball1 = new THREE.Mesh(new THREE.SphereGeometry(10,100,100),new THREE.MeshStandardMaterial({
        color: 0xffffff,
        envMap: scene.background,
        roughnessMap:new THREE.TextureLoader().load(roughness_map),
        metalnessMap:new THREE.TextureLoader().load(roughness_map),
        metalness:1,
        roughness:0.2
    }));

    ball1.position.set(20,0,0);

    scene.add(...[ball0,ball1]);


    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    let clock = new THREE.Clock();

    let stats = initStats();

    let DatControls = function () { };
    let controls = new DatControls();
    let gui = new dat.GUI();

    let step = 0,invert=1;

    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        if(step>2*Math.PI){
            step -= 2*Math.PI;
            invert *= -1;
        }
        else{
            step += 0.02;
        }

        watch_ball.position.x = 70*Math.cos(step)/4 - 70/4;
        watch_ball.position.z = 70*Math.sin(step)/2;

        watch_ball.position.x *= invert;


        pointLight.position.copy(watch_ball.position)

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
