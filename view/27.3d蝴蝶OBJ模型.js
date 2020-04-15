import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
// import house_json from '../public/models/house/house.json'
// import { MTLLoader,OBJLoader } from "three-obj-mtl-loader";
require("three/examples/js/loaders/MTLLoader")
require("three/examples/js/loaders/OBJLoader")
import butterfly_mtl from '../public/models/butterfly/butterfly.mtl';
import butterfly_obj from '../public/models/butterfly/butterfly.obj';
import butterfly_skin from "../public/models/butterfly/butterflywings.png"
const path = require("path");
window.addEventListener("load", init);



function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    let spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    let ambientLight = new THREE.AmbientLight("rgb(255,255,255)", 1);

    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-80, 60, 30);
    spotLight.castShadow = true;

    scene.add(ambientLight);
    scene.add(spotLight);

    camera.position.set(0, 0, 100);
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


    function loadMTL(mtl, path) {
        let mtlLoader = new THREE.MTLLoader();
        // if(path) mtlLoader.setPath(path);

        return new Promise((resolve, reject) => {
            mtlLoader.load(mtl, materials => {
                materials.preload();
                resolve(materials);
            })
        })
    }

    function loadOBJ(obj, materials) {
        let objLoader = new THREE.OBJLoader();
        if (materials) {
            objLoader.setMaterials(materials);
        }
        return new Promise((resolve, reject) => {
            objLoader.load(obj, object => {
                materials.preload();
                resolve(object);
            })
        })
    }

    // let butterfly_path = path.resolve(__dirname, 'public/models') + "/";
    // console.log(butterfly_path)
    loadMTL(butterfly_mtl)
        .then(materials => {
            let skin = new THREE.TextureLoader().load(butterfly_skin);
            materials.materials["butterfly_wings_butterflywings.png"] = new THREE.MeshPhongMaterial({
                map: skin
            });
            return loadOBJ(butterfly_obj, materials)
        })
        .then(object => {
            [0, 2, 4, 6].forEach(i => {
                object.children[i].rotation.z = 0.3 * Math.PI
            });

            [1, 3, 5, 7].forEach(i => {
                object.children[i].rotation.z = -0.3 * Math.PI
            });

            let wing2 = object.children[5];
            let wing1 = object.children[4];

            wing1.material.opacity = 0.9;
            wing1.material.transparent = true;
            wing1.material.depthTest = false;
            wing1.material.side = THREE.DoubleSide;

            wing2.material.opacity = 0.9;
            wing2.material.depthTest = false;
            wing2.material.transparent = true;
            wing2.material.side = THREE.DoubleSide;

            object.scale.set(140, 140, 140);
            object.rotation.x = 0.2;
            object.rotation.y = -1.3;
            // object.children.forEach(mesh=>{
            //     mesh.material= new THREE.MeshPhysicalMaterial({
            //         color: new THREE.Color("#7955C3"),
            //         // metalness:0.7, //金属感程度
            //         // roughness:0,   //粗糙程度
            //         clearcoat:0.7, //清漆
            //         clearcoatRoughness: 0.3, //清漆粗糙程度
            //         reflectivity:1 //反光度
            //     })
            // })
            scene.add(object);
        })






    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    // let DatControls = function(){};
    // let controls = new DatControls();
    // let gui = new dat.GUI();


    ; (function run() {
        trackballControls.update(clock.getDelta());
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
