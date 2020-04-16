import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";

require("three/examples/js/loaders/PLYLoader");

import TWEEN from "tween";
import car_ply from "../public/models/carcloud/carcloud.ply";

window.addEventListener("load", init);



function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.copy(scene.position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = 15;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "spotLight"

    scene.add(spotLight);

    let ambientLight = new THREE.AmbientLight(0x343434);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

    camera.position.set(5, 10, 25);
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


    let loader = new THREE.PLYLoader();
    
   
    loader.load(car_ply,geom=>{
        let material = new THREE.PointsMaterial({
            color:0xFFFFFF,
            size:.5,
            opacity: 0.6,
            transparent:true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map:createMap()
        });
        let origPosition = geom.attributes['position'].clone()
        geom.origPosition = origPosition
        let group = new THREE.Points(geom,material);
        scene.add(group);
    })

    function createMap(){
        let canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;

        let ctx = canvas.getContext("2d");

        ctx.save();
        let gradient = ctx.createRadialGradient(canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width/2)
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.restore();

        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    console.log(TWEEN)

    var posSrc = { pos: -10}  
    var tween = new TWEEN.Tween(posSrc).to({pos: 10}, 3000); 
    tween.easing(TWEEN.Easing.Quadratic.InOut); 
   
    var tweenBack = new TWEEN.Tween(posSrc).to({pos: -10}, 3000); 
    tweenBack.easing(TWEEN.Easing.Bounce.Out); 
    
    tweenBack.chain(tween); 
    tween.chain(tweenBack);
  
    tween.start();

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    let DatControls = function(){};
    let controls = new DatControls();
    let gui = new dat.GUI();
   
    function changeCarPoint(mesh){
        TWEEN.update();

        // console.log(posSrc.pos)
        let positionArray = mesh.geometry.attributes['position']
        let origPosition = mesh.geometry.origPosition;

        for (var i = 0; i < positionArray.count; i++) {
            let oldPosX = origPosition.getX(i);
            // let oldPosY = origPosition.getY(i);
            // let oldPosZ = origPosition.getZ(i);
            positionArray.setX(i, oldPosX + posSrc.pos);
            // positionArray.setY(i, oldPosY * posSrc.pos);
            // positionArray.setZ(i, oldPosZ * posSrc.pos);
        }
        positionArray.needsUpdate = true;
    }

    ; (function run() {
        trackballControls.update(clock.getDelta());
        stats.update();

        scene.traverse(item=>{
            if(item instanceof THREE.Points){
                changeCarPoint(item)
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

    function initTrackballControls(camera, renderer) {
        let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.2;
        trackballControls.panSpeed = 0.8;
        trackballControls.noZoom = false;
        trackballControls.noPan = false;
        trackballControls.staticMoving = true;
        trackballControls.dynamicDampingFactor = 0.3;
        trackballControls.keys = [65, 83, 68];
        return trackballControls;
    }

}
