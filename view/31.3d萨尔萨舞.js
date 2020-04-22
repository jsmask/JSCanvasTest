import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");
require("three/examples/js/loaders/FBXLoader");



import floor from "../public/images/3d/general/bathroom.jpg"
import salsa from "../public/models/salsa/salsa.fbx"

import { Zlib } from "../public/src/inflate.min.js"
window.Zlib = Zlib;

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0x969644, 2);
    spotLight.position.set(-100, 200, 100);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    // let lightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(lightHelper)

    camera.position.set(0, 50, 100);
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

    let plane_map = new THREE.TextureLoader().load(floor);
    plane_map.wrapS = THREE.RepeatWrapping;
    plane_map.wrapT = THREE.RepeatWrapping;
    plane_map.repeat.set(5,5);
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        map:plane_map,
        side:THREE.DoubleSide
    }));
    plane.receiveShadow = true;

    plane.rotation.x = -0.5*Math.PI;

    scene.add(plane);


    let loader = new THREE.FBXLoader();
    let mixer,animationClip,clipAction;
    loader.load(salsa, result => {

        result.scale.set(0.2,0.2,0.2);
        result.castShadow= true;
        result.receiveShadow = true;
        result.children.forEach(item=>{
            item.castShadow= true;
            item.receiveShadow = true;
        })
        scene.add(result);

        console.log(result);
        mixer = new THREE.AnimationMixer(result);
        animationClip = result.animations[0];
        clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        enableControls()
    })

    let mixerControls = {
        timeScale: 1,
        stopAction: function() { console.log(mixer); mixer.stopAllAction() },
        playAction: function() { console.log(mixer); clipAction.play(); },
    }

    function enableControls() {
        let gui = new dat.GUI();
        let mixerFolder = gui.addFolder("AnimationMixer")
        mixerFolder.add(mixerControls, "timeScale", 0, 100).onChange(timeScale => {
            mixer.timeScale = timeScale;
        });
        mixerFolder.add(mixerControls, "stopAction").listen();
        mixerFolder.add(mixerControls, "playAction").listen();
    }



    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);

    let clock = new THREE.Clock();

    let stats = initStats();

    // let DatControls = function () { };
    // let controls = new DatControls();
    // let gui = new dat.GUI();

    ; (function run() {
        let delta = clock.getDelta();

        trackballControls.update(delta);
        stats.update();

        if(mixer){
            mixer.update(delta);
        }

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
