
import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import wood_skin from '../public/images/3d/general/wood-2.jpg';

// import right_map from "../public/images/3d/cubemap/flowers/right.png"
// import left_map from "../public/images/3d/cubemap/flowers/left.png"
// import top_map from "../public/images/3d/cubemap/flowers/top.png"
// import bottom_map from "../public/images/3d/cubemap/flowers/bottom.png"
// import front_map from "../public/images/3d/cubemap/flowers/front.png"
// import back_map from "../public/images/3d/cubemap/flowers/back.png"

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

    let spotLight = new THREE.SpotLight(0xcFcF56, .75);
    spotLight.position.set(-50, 120, 90)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    scene.add(spotLight);

    // let lightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(lightHelper);


    // let cubeBg = new THREE.CubeTextureLoader().load([right_map, left_map, top_map, bottom_map, front_map, back_map]);
    // scene.background = cubeBg;

    camera.position.set(0, 65, 70);
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


    
    scene.setGravity(new THREE.Vector3(0, -100, 0));
    createGroundAndWalls();
    let points = getPoints();
    let stones = [];
    let colors = ["#2d85f0","#f4433c","#ffbc32","#0aa858"];
    points.forEach((point, index)=>{
        let stoneGeom = new THREE.BoxGeometry(0.5, 6, 2);
        let stone = new Physijs.BoxMesh(stoneGeom, Physijs.createMaterial(new THREE.MeshStandardMaterial({
          color: new THREE.Color(colors[index % colors.length]), 
          transparent: true, 
          opacity: 0.85
        })));
    
        stone.position.copy(point);
        stone.lookAt(scene.position);
        
        stone.position.y = 4;
        stone.castShadow = true;
        stone.receiveShadow = true;
    
        stone.__dirtyRotation = true;
        scene.add(stone);
        stones.push(stone);
    });

    stones[0].rotation.x = 0.4;
    stones[0].__dirtyRotation = true;

    function getPoints() {
        let points = [];
        let r = 30;
        let cX = -2;
        let cY = -2;
        let v = 0.6;
      
        var circleOffset = 0;
        for (var i = 0; i < 1200; i += 6 + circleOffset) {
      
            circleOffset = 4.5 * (i / 360);

            let x = (r - i/r*v) * Math.cos(i * (Math.PI / 180)) + cX;
            let z = (r - i/r*v) * Math.sin(i * (Math.PI / 180)) + cY;
            let y = 0;
      
            points.push(new THREE.Vector3(x, y, z));
        }
      
        return points;
      }
      


    function createGroundAndWalls() {
        let loader = new THREE.TextureLoader();
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            map: loader.load(wood_skin)
        }),.9,.3);

        let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 2, 60), material,0);
        ground.receiveShadow = true;
        ground.castShadow = true;
        scene.add(ground);

        let top_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 8, 2), material,0);
        top_wall.position.set(0, 3, -31);
        top_wall.receiveShadow = true;
        top_wall.castShadow = true;
        scene.add(top_wall);

        let bottom_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 8, 2), material,0);
        bottom_wall.position.set(0, 3, 31);
        bottom_wall.receiveShadow = true;
        bottom_wall.castShadow = true;
        scene.add(bottom_wall);

        let left_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 8, 64), material,0);
        left_wall.position.set(-31, 3, 0);
        left_wall.receiveShadow = true;
        left_wall.castShadow = true;
        scene.add(left_wall);

        let right_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 8, 64), material,0);
        right_wall.position.set(31, 3, 0);
        right_wall.receiveShadow = true;
        right_wall.castShadow = true;
        scene.add(right_wall);

    }        

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();
    //let DatControls = function () { };
    //let controls = new DatControls();
    //let gui = new dat.GUI();


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