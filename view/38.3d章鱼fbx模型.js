


import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

require("three/examples/js/loaders/FBXLoader");
import  img_a from "../public/models/octbot/octcab.jpg"
import  img_b from "../public/models/octbot/octbot.jpg"
import  img_c from "../public/models/octbot/octcab2.jpg"
import  img_d from "../public/models/octbot/octeye.jpg"
import  img_e from "../public/models/octbot/octt1.jpg"
import  img_f from "../public/models/octbot/octt2.jpg"
import  img_g from "../public/models/octbot/octt3.jpg"
import  img_h from "../public/models/octbot/octt4.jpg"
import  img_i from "../public/models/octbot/octt5.jpg"
import  img_j from "../public/models/octbot/octt6.jpg"
import  img_k from "../public/models/octbot/octt7.jpg"
import  img_l from "../public/models/octbot/octt8.jpg"

[img_a,img_b,img_c,img_d,img_e,img_f,img_g,img_h,img_i,img_j,img_k,img_l].forEach(src=>{
    loadImg(src);
})
import floor from "../public/images/3d/general/plaster.jpg"
import octbot_fbx from "../public/models/octbot/file.fbx"
import { Zlib } from "../public/src/inflate.min.js"
window.Zlib = Zlib;

import TWEEN from "tween";

// require("../public/src/physi");
// const Physijs = window.Physijs;

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

    let spotLight = new THREE.SpotLight(0xcFcF56, .75);
    spotLight.position.set(-50, 120, 90)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    scene.add(spotLight);

    // let lightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(lightHelper);

    camera.position.set(0, 75, 90);
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



    let tweenData = { scale: 1}  
    let tween = new TWEEN.Tween(tweenData).to({scale: 0.75}, 1000); 
    tween.easing(TWEEN.Easing.Back.InOut);    
    let tweenBack = new TWEEN.Tween(tweenData).to({scale: 1}, 1000); 
    tweenBack.easing(TWEEN.Easing.Elastic.InOut); 

    console.log(TWEEN.Easing)
    
    tweenBack.chain(tween); 
    tween.chain(tweenBack);

    let loader = new THREE.FBXLoader();
    loader.setResourcePath("./public/models/pic/");
    loader.load(octbot_fbx,group=>{
        // group.children[0].material[0].
        group.children.forEach(mesh=>{
            if(mesh instanceof THREE.Mesh){
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        })
        group.name = "octopus";
        group.scale.set(.5,.5,.5);
        group.position.set(0,20,0)
        scene.add(group);
        tween.start();
        
        // let mixer = new THREE.AnimationMixer(result);
        // console.log(mixer)
    });
    
    

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();
    //let DatControls = function () { };
    //let controls = new DatControls();
    //let gui = new dat.GUI();

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshPhongMaterial({
        color:0xFFFFFF,
        side:THREE.DoubleSide,
        map:new THREE.TextureLoader().load(floor)
    }))
    plane.rotation.x = -0.5*Math.PI;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);
    

    let step = 0;
    ; (function run() {
       
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        step+=0.01;
        step %= 2*Math.PI;
        
        scene.traverse(mesh=>{
            if(mesh.name == "octopus"){
                TWEEN.update();
                mesh.scale.set(0.5*tweenData.scale,0.5*tweenData.scale,0.5*tweenData.scale);
                mesh.position.z = Math.cos(step)*10;
                mesh.position.y = 20 + Math.sin(step)*10;
                mesh.rotation.z = step;
            }
        })

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
