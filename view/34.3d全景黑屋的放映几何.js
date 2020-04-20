import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import full_bg from "../public/images/3d/cubemap/full_bg_0.jpg"
import movie from "../public/other/movie.ogv"

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 10000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let ambientLight = new THREE.AmbientLight(0xCCCCCC);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xFFFFDF,1,1000);
    spotLight.position.set(-200,0,100)
    scene.add(spotLight);


    camera.position.set(0, 0, 200);
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
    let cubeMap = loader.load(full_bg);
    cubeMap.mapping = THREE.EquirectangularReflectionMapping;
    cubeMap.magFilter = THREE.LinearFilter;
    cubeMap.minFilter = THREE.LinearMipmapLinearFilter;

    let equirectShader = THREE.ShaderLib["equirect"];
    let equirectMaterial = new THREE.ShaderMaterial({
        fragmentShader:equirectShader.fragmentShader,
        vertexShader:equirectShader.vertexShader,
        uniforms:equirectShader.uniforms,
        side:THREE.BackSide,
        depthWrite:false
    });
    equirectMaterial.uniforms["tEquirect"].value = cubeMap;

    let skyBox = new THREE.Mesh(new THREE.BoxGeometry(10000,10000,10000),equirectMaterial)
    scene.add(skyBox);

    let video = document.createElement("video");
    video.src = movie;
    video.loop = true;
    video.autoplay = true;

    let texture = new THREE.VideoTexture(video);
    texture.format = THREE.RGBFormat;
    // texture.wrapT = THREE.LinearFilter;
    // texture.wrapS = THREE.LinearFilter;

    let ball = new THREE.Mesh(new THREE.SphereGeometry(18,100,100),new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        map:texture
    }));
    let cube = new THREE.Mesh(new THREE.BoxGeometry(30,30,30),new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        map:texture
    }));
    let polyhedron = new THREE.Mesh( new THREE.IcosahedronGeometry(20,0),new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        map:texture
    }));
    ball.position.set(0,0,0);
    cube.position.set(-60,0,0);
    polyhedron.position.set(60,0,0);
    scene.add(...[ball,cube,polyhedron]);


    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    let clock = new THREE.Clock();

    let stats = initStats();

    let DatControls = function () { };
    let controls = new DatControls();
    let gui = new dat.GUI();


    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
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
