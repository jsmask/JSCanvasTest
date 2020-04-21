import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import ball_normal_map from "../public/images/3d/engraved/Engraved_Metal_003_NORM.jpg"
import ball_ao_map from "../public/images/3d/engraved/Engraved_Metal_003_OCC.jpg"
import ball_shininess_map from "../public/images/3d/engraved/Engraved_Metal_003_ROUGH.jpg"

import floor_wood from '../public/images/3d/general/floor-wood.jpg';


// 后期处理
require("three/examples/js/postprocessing/EffectComposer")
require("three/examples/js/postprocessing/ShaderPass")
require("three/examples/js/postprocessing/MaskPass")
require("three/examples/js/postprocessing/RenderPass")
require("three/examples/js/shaders/CopyShader")
require("three/examples/js/shaders/BokehShader")
require("three/examples/js/postprocessing/BokehPass")


import right_map from "../public/images/3d/cubemap/flowers/right.png"
import left_map from "../public/images/3d/cubemap/flowers/left.png"
import top_map from "../public/images/3d/cubemap/flowers/top.png"
import bottom_map from "../public/images/3d/cubemap/flowers/bottom.png"
import front_map from "../public/images/3d/cubemap/flowers/front.png"
import back_map from "../public/images/3d/cubemap/flowers/back.png"


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    renderer.autoClear = false;

    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xcFcF56, 1);
    spotLight.position.set(0, 60, 180)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    scene.add(spotLight);

    // let lightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(lightHelper);

    camera.position.set(0, 35, 180);
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


    let loader = new THREE.TextureLoader();

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: loader.load(floor_wood),
        side: THREE.DoubleSide
    }));
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    let ball = new THREE.Mesh(new THREE.SphereGeometry(10, 100, 100), new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        envMap: new THREE.CubeTextureLoader().load([right_map, left_map, top_map, bottom_map, front_map, back_map]),
        normalMap: loader.load(ball_normal_map),
        aoMap: loader.load(ball_ao_map),
        // shininessMap: loader.load(ball_shininess_map),
        metalness: 1,
        roughness: 0.3,
    }));
    ball.castShadow = true;
    ball.receiveShadow = true;
    ball.position.set(0, 10, 120);
    scene.add(ball);


    createCube(-80, 0, "#4f5dD4");
    createCube(80, 0, "#e45d4f");

    for (let i = 0; i < 9; i++) {
        createCube(-200 + i * 50, -150, "#54ed4f");
    }

    let composer = new THREE.EffectComposer(renderer);
    let renderPass = new THREE.RenderPass(scene, camera);
    let parms = {
        focus: 64,
        aspect: camera.aspect,
        aperture: 0.0001,
        maxblur: 1,
    }
    let bokehPass = new THREE.BokehPass(scene, camera, parms);
    bokehPass.renderToScreen = true;
    let copyPass = new THREE.ShaderPass();
    copyPass.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(bokehPass);
    //composer.addPass(copyPass);



    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();
    let DatControls = function () {
        this.enabled = true;
        this.focus = parms.focus;
        this.aperture = parms.aperture;
        this.maxblur = parms.maxblur;
    };
    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls,"enabled");
    gui.add(controls,"focus",0,500,1).onChange(e => bokehPass.uniforms["focus"].value = e );
    gui.add(controls,"aperture",0,0.01,0.0001).onChange(e => bokehPass.uniforms["aperture"].value = e );
    gui.add(controls,"maxblur",0,1,0.01).onChange(e => bokehPass.uniforms["maxblur"].value = e );


    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        ball.rotation.y -=0.01;

        requestAnimationFrame(run);
        !controls.enabled?renderer.render(scene,camera):composer.render(delta);
    })();

    function initStats(type = 0) {
        let stats = new Stats();
        stats.showPanel(type);
        document.body.append(stats.dom);
        return stats;
    }

    function createCube(x = 0, z = 0, c = "#ffffff") {
        let cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshStandardMaterial({
            color: new THREE.Color(c),
            metalness: 0.1,
            roughness: 0.2,
        }))
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.set(x, 15.5, z);
        scene.add(cube);
    }

}
