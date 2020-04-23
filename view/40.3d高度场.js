
import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import weave_map from '../public/images/3d/general/weave.jpg';
import weave_bump_map from '../public/images/3d/general/weave-bump.jpg';

require("../public/src/perlin");

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


    camera.position.set(0, 85, 180);
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

    createGround();

    let colors = ["#2d85f0", "#f4433c", "#ffbc32", "#0aa858"];
    

    function createGround() {
        let loader = new THREE.TextureLoader();
        let map = loader.load(weave_map);
        let pn = new Perlin('rnd' + new Date().getTime());
        let vz = 8;
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(6,6)
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            map,
            bumpMap:loader.load(weave_bump_map),
            side:THREE.DoubleSide
        }), .3, .8);
        let geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        geometry.vertices.forEach(vec=>{
            vec.z = pn.noise(vec.x / 12, vec.y / 12, 0) * vz;
        })
        let ground = new Physijs.BoxMesh(geometry, material, 0);
        ground.receiveShadow = true;
        ground.castShadow = true;
        ground.rotation.x = -0.5 *Math.PI;
        ground.tag = "land";

        scene.add(ground);
    }

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();

    let meshes = [];
    let DatControls = function () { };


    function getMeshMaterial(){
        return Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: new THREE.Color(colors[~~(colors.length * Math.random())])
        }), .4, .7);
    }

    function changeMesh(mesh){
        mesh.position.set(rp([-80,80]),50,rp([-80,80]));
        mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    DatControls.prototype.removeAll = function () {
        meshes.forEach(function (e) { scene.remove(e); });
        meshes.length = 0;
    }

    DatControls.prototype.addCube = function () {
        let cube = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 4, 4), getMeshMaterial());
        changeMesh(cube);
        meshes.push(cube);
        scene.add(cube);
    }

    DatControls.prototype.addSphere = function () {
        let sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(2, 10, 10), getMeshMaterial());
        changeMesh(sphere);
        meshes.push(sphere)
        scene.add(sphere);
    }

    DatControls.prototype.addCylinder = function () {
        let cylinder = new Physijs.CylinderMesh(new THREE.CylinderGeometry(2, 2, 6), getMeshMaterial());
        changeMesh(cylinder);
        meshes.push(cylinder);
        scene.add(cylinder);
    }

    DatControls.prototype.addCone = function () {
        let cone = new Physijs.ConeMesh(new THREE.CylinderGeometry(0,3,7,20,10), getMeshMaterial());
        changeMesh(cone);
        meshes.push(cone);
        scene.add(cone);
    }

    DatControls.prototype.addCapsule = function () {
        let merged = new THREE.Geometry();
        let cyl = new THREE.CylinderGeometry(2, 2, 6);
        let top = new THREE.SphereGeometry(2);
        let bot = new THREE.SphereGeometry(2);
        let matrix = new THREE.Matrix4();
        matrix.makeTranslation(0, 3, 0);
        top.applyMatrix4(matrix);
        matrix.makeTranslation(0, -3, 0);
        bot.applyMatrix4(matrix);

        merged.merge(top);
        merged.merge(bot);
        merged.merge(cyl);

        let capsule = new Physijs.CapsuleMesh(merged, getMeshMaterial());
        changeMesh(capsule);
        meshes.push(capsule);
        scene.add(capsule);
    }

    DatControls.prototype.addConvex = function () {
        let convex = new Physijs.ConvexMesh(new THREE.TorusKnotGeometry(2,2.5,64,3,3,7), getMeshMaterial());
        changeMesh(convex);
        meshes.push(convex);
        scene.add(convex);
    }

    let controls = new DatControls();
    let gui = new dat.GUI();

    gui.add(controls, "addCube");
    gui.add(controls, "addSphere");
    gui.add(controls, "addCylinder");
    gui.add(controls, "addCone");
    gui.add(controls, "addCapsule");
    gui.add(controls, "addConvex");
    gui.add(controls, "removeAll");


    // 碰撞检测
    // mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {});


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