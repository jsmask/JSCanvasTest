import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
import diamond from '../public/models/molecules/diamond.pdb'
require("three/examples/js/loaders/PDBLoader");

const path = require("path");
window.addEventListener("load", init);



function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    let light = new THREE.DirectionalLight(new THREE.Color("#fff"),2);
    let ambientLight = new THREE.AmbientLight("rgb(255,255,255)", 1);

    light.position.set(0,100,0)
    scene.add(ambientLight);
    scene.add(light);

    camera.position.set(-15, 10, 0);
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

    let loader = new THREE.PDBLoader();

    // 蛋白质数据银行 http://www.rcsb.org/
    // THREE.PDBLoader一部分pdb信息无法加载 比如6m03（载脂蛋白形式的COVID-19主要蛋白酶的晶体结构）

    loader.load(diamond, geometries => {
        let group = new THREE.Group();
        let atoms = geometries.geometryAtoms;
        let bonds = geometries.geometryBonds;

        for (let i = 0, len = atoms.attributes.position.count; i < len; i++) {
            let startPos = new THREE.Vector3();
            startPos.x = atoms.attributes.position.getX(i);
            startPos.y = atoms.attributes.position.getY(i);
            startPos.z = atoms.attributes.position.getZ(i);

            let color = new THREE.Color();
            color.r = atoms.attributes.color.getX(i);
            color.g = atoms.attributes.color.getY(i);
            color.b = atoms.attributes.color.getZ(i);

            let mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshPhongMaterial({
                color
            }))
            mesh.position.copy(startPos);
            group.add(mesh);
        }


        for (let i = 0, len = bonds.attributes.position.count; i < len; i += 2) {
            let startPos = new THREE.Vector3();
            startPos.x = bonds.attributes.position.getX(i);
            startPos.y = bonds.attributes.position.getY(i);
            startPos.z = bonds.attributes.position.getZ(i);
            let endPos = new THREE.Vector3();
            endPos.x = bonds.attributes.position.getX(i + 1);
            endPos.y = bonds.attributes.position.getY(i + 1);
            endPos.z = bonds.attributes.position.getZ(i + 1);
            let path = new THREE.CatmullRomCurve3([startPos,endPos]);
            let tube = new THREE.TubeGeometry(path,1,0.05);

            let mesh = new THREE.Mesh(tube, new THREE.MeshPhongMaterial({
                color: new THREE.Color("#946113")
            }))
            group.add(mesh);
        }

        scene.add(group);
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
