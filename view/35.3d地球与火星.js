import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import earth_map from "../public/images/3d/earth/Earth.png"
import earth_normal_map from "../public/images/3d/earth/EarthNormal.png"
import earth_spec_map from "../public/images/3d/earth/EarthSpec.png"

import mars_map from "../public/images/3d/mars/mars_1k_color.jpg"
import mars_normal_map from "../public/images/3d/mars/mars_1k_normal.jpg"

import bg_map from "../public/images/bg4.jpg"


// 后期处理
require("three/examples/js/postprocessing/EffectComposer")
require("three/examples/js/postprocessing/ShaderPass")
require("three/examples/js/postprocessing/MaskPass")
require("three/examples/js/postprocessing/RenderPass")
require("three/examples/js/shaders/CopyShader")
require("three/examples/js/shaders/SepiaShader")
require("three/examples/js/shaders/ColorifyShader")


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

    let spotLight = new THREE.SpotLight(0xFFFFDF, 0.7, 1000);
    spotLight.position.set(-200, 0, 100)
    scene.add(spotLight);

    scene.background = new THREE.TextureLoader().load(bg_map);


    camera.position.set(0, 0, 60);
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

    let sceneEarth = new THREE.Scene();
    let sceneMars = new THREE.Scene();

    let earth = new THREE.Mesh(new THREE.SphereGeometry(15, 100, 100), new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: new THREE.TextureLoader().load(earth_map),
        normalMap: new THREE.TextureLoader().load(earth_normal_map),
        specularMap: new THREE.TextureLoader().load(earth_spec_map),
        normalScale: new THREE.Vector2(20,20),
        shininess: 0.5,
        specular: new THREE.Color(0x4444aa),
    }));
    earth.position.set(0, 0, 0);
    earth.scale.set(1.25,1.25,1.25);
    earth.translateX(-20);
    sceneEarth.add(ambientLight.clone());
    sceneEarth.add(spotLight.clone());
    sceneEarth.add(earth);

    let mars = new THREE.Mesh(new THREE.SphereGeometry(15,100,100),new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: new THREE.TextureLoader().load(mars_map),
        normalMap: new THREE.TextureLoader().load(mars_normal_map),
        normalScale: new THREE.Vector2(6, 6),
        shininess: 0.5
    }));
    mars.position.set(25,-10,-150);
    mars.translateX(20);
    sceneMars.add(ambientLight.clone());
    sceneMars.add(spotLight.clone());
    sceneMars.add(mars);

    let effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    let bgRenderPass = new THREE.RenderPass(scene,camera);
    let earthRenderPass = new THREE.RenderPass(sceneEarth,camera);
    earthRenderPass.clear = false;
    let marsRenderPass = new THREE.RenderPass(sceneMars,camera);
    marsRenderPass.clear = false;

    let clearMask = new THREE.ClearMaskPass();
    let earthMask = new THREE.MaskPass(sceneEarth, camera);
    let marsMask = new THREE.MaskPass(sceneMars, camera);
    //inverse 蒙层翻转
    //earthMask.inverse = true;

    let effectSepia = new THREE.ShaderPass(THREE.SepiaShader);
    effectSepia.uniforms['amount'].value = 0.8;
    let effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
    let effectColor = "rgb(220,75,45)";
    effectColorify.uniforms['color'].value = new THREE.Color(effectColor);

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();
    let DatControls = function () {
        this.amount = effectSepia.uniforms['amount'].value;
        this.color = effectColor;
    };
    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls,"amount",0,15,0.1).onChange(e=>effectSepia.uniforms['amount'].value = e);
    gui.addColor(controls,"color").onChange( e=> {
        effectColorify.uniforms['color'].value = new THREE.Color(e)
    });

    let composer = new THREE.EffectComposer(renderer);
    composer.renderTarget1.stencilBuffer = true;
    composer.renderTarget2.stencilBuffer = true;
    composer.addPass(bgRenderPass);
    composer.addPass(earthRenderPass);
    composer.addPass(marsRenderPass);
    composer.addPass(marsMask);
    composer.addPass(effectColorify);
    composer.addPass(clearMask);
    composer.addPass(earthMask);
    composer.addPass(effectSepia);
    composer.addPass(clearMask);
    composer.addPass(effectCopy);

    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        earth.rotation.y += 0.001;
        mars.rotation.y -= 0.001;

        requestAnimationFrame(run);
        composer.render(delta);
    })();

    function initStats(type = 0) {
        let stats = new Stats();
        stats.showPanel(type);
        document.body.append(stats.dom);
        return stats;
    }

}
