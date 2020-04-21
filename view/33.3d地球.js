import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import earth_map from "../public/images/3d/earth/Earth.png"
import earth_normal_map from "../public/images/3d/earth/EarthNormal.png"
import earth_spec_map from "../public/images/3d/earth/EarthSpec.png"


// 后期处理
require("three/examples/js/postprocessing/EffectComposer")
require("three/examples/js/postprocessing/ShaderPass")
require("three/examples/js/postprocessing/MaskPass")
require("three/examples/js/postprocessing/RenderPass")
require("three/examples/js/shaders/CopyShader")
require("three/examples/js/postprocessing/FilmPass")
require("three/examples/js/shaders/FilmShader")
require("three/examples/js/postprocessing/BloomPass")
require("three/examples/js/shaders/ConvolutionShader")
require("three/examples/js/postprocessing/DotScreenPass")
require("three/examples/js/shaders/DotScreenShader")
require("three/examples/js/postprocessing/GlitchPass")
require("three/examples/js/shaders/DigitalGlitch")


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let ambientLight = new THREE.AmbientLight(0xCCCCCC);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xFFFFDF, 1, 1000);
    spotLight.position.set(-200, 0, 100)
    scene.add(spotLight);


    camera.position.set(0, 20, 40);
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

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    let clock = new THREE.Clock();

    let stats = initStats();

    let DatControls = function () {
        this.specular = "rgb(40,40,60)";
        this.shininess = 0.5;
        this.normalScale = 20;
    };
    DatControls.prototype.render = function () {
        this.earth.material.normalScale = new THREE.Vector2(this.normalScale, this.normalScale);
        this.earth.material.shininess = this.shininess;
        this.earth.material.specular = new THREE.Color(this.specular);
    }
    let controls = new DatControls();
    let gui = new dat.GUI();

    gui.addColor(controls, "specular").onChange(e => controls.render());
    gui.add(controls, "shininess", 0, 1, 0.1).onChange(e => controls.render());
    gui.add(controls, "normalScale", 0, 100, 1).onChange(e => controls.render());


    let earth = controls.earth = new THREE.Mesh(new THREE.SphereGeometry(15, 100, 100), new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        map: new THREE.TextureLoader().load(earth_map),
        normalMap: new THREE.TextureLoader().load(earth_normal_map),
        specularMap: new THREE.TextureLoader().load(earth_spec_map),
        normalScale: new THREE.Vector2(controls.normalScale, controls.normalScale),
        specular: new THREE.Color(controls.specular),
        shininess: controls.shininess
    }));
    earth.position.set(0, 0, 0);
    scene.add(earth);


    let renderPass = new THREE.RenderPass(scene, camera);
    let effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;


    let composer1 = new THREE.EffectComposer(renderer);
    let composer2 = new THREE.EffectComposer(renderer);
    let composer3 = new THREE.EffectComposer(renderer);
    let composer4 = new THREE.EffectComposer(renderer);


    var effectGlitch = new THREE.GlitchPass();
    // let glitchControls = new function () {
  
    // }
    // let glitchPass = gui.addFolder("glitchPass");
    // console.log(effectGlitch)

    composer1.addPass(renderPass);
    composer1.addPass(effectGlitch);
    composer1.addPass(effectCopy);


    let filmPass = gui.addFolder("FilmPass");
    let filmControls = new function () {
        this.grayscale = false;
        this.nIntensity = 0.8;
        this.sCount = 256;
        this.sIntensity = 0.325;
    }
    let effectFilm = new THREE.FilmPass(
        filmControls.nIntensity,
        filmControls.sIntensity,
        filmControls.sCount,
        false
    );
    effectFilm.renderToScreen = true;



    filmPass.add(filmControls, "grayscale").onChange(e => effectFilm.uniforms["grayscale"].value = e);
    filmPass.add(filmControls, "nIntensity", 0, 1, 0.1).onChange(e => effectFilm.uniforms["nIntensity"].value = e);
    filmPass.add(filmControls, "sCount", 0, 1024, 1).onChange(e => effectFilm.uniforms["sCount"].value = e);
    filmPass.add(filmControls, "sIntensity", 0, 1, 0.01).onChange(e => effectFilm.uniforms["sIntensity"].value = e);


    composer2.addPass(renderPass);
    composer2.addPass(effectFilm);
    composer2.addPass(effectCopy);


    let bloomControls = new function () {
        this.strength = 3;
        this.kernelSize = 25;
        this.sigma = 5.0;
        this.resolution = 256;
    }
    let effectBloom = new THREE.BloomPass(
        bloomControls.strength,
        bloomControls.kernelSize,
        bloomControls.sigma,
        controls.resolution
    )
    bloomControls.render = () => {
        composer3.passes[1] = new THREE.BloomPass(bloomControls.strength, bloomControls.kernelSize, bloomControls.sigma, bloomControls.resolution);
    }
    composer3.addPass(renderPass);
    composer3.addPass(effectBloom);
    composer3.addPass(effectCopy);

    let bloomPass = gui.addFolder("BloomPass");
    bloomPass.add(bloomControls, "strength", 0, 100).onChange(e => bloomControls.render());
    bloomPass.add(bloomControls, "kernelSize", 1, 100).onChange(e => bloomControls.render());
    bloomPass.add(bloomControls, "sigma", 0.1, 20, 0.1).onChange(e => bloomControls.render());
    bloomPass.add(bloomControls, "resolution", 0, 1024).onChange(e => bloomControls.render());


    let dotScreenControls = new function () {
        this.angle = 1.57;
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.scale = 1;
    }

    let effectDotScreen = new THREE.DotScreenPass(new THREE.Vector2(dotScreenControls.centerX, dotScreenControls.centerY), dotScreenControls.angle, dotScreenControls.scale);
    let dotScreenPass = gui.addFolder("dotScreenPass");
    dotScreenPass.add(dotScreenControls, "angle", 0, 5, 0.1).onChange(e => effectDotScreen.uniforms["angle"].value = e);
    dotScreenPass.add(dotScreenControls, "scale", 0, 3.14, 0.01).onChange(e => effectDotScreen.uniforms["scale"].value = e);
    dotScreenPass.add(dotScreenControls, "centerX", 0, 5, 0.01).onChange(e => effectDotScreen.uniforms["center"].value = new THREE.Vector2(e, dotScreenControls.centerY));
    dotScreenPass.add(dotScreenControls, "centerY", 0, 5, 0.01).onChange(e => effectDotScreen.uniforms["center"].value = new THREE.Vector2(dotScreenControls.centerX, e));


    composer4.addPass(renderPass);
    composer4.addPass(effectDotScreen);
    composer4.addPass(effectCopy);


    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        renderer.autoClear = false;
        renderer.clear();

        renderer.setViewport(0, H / 2, W / 2, H / 2);
        composer1.render(delta)

        renderer.setViewport(0, 0, W / 2, H / 2);
        composer2.render(delta)

        renderer.setViewport(W / 2, H / 2, W / 2, H / 2);
        composer3.render(delta)

        renderer.setViewport(W / 2, 0, W / 2, H / 2);
        composer4.render(delta)

        earth.rotation.y -= 0.01;

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
