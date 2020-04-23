
import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import wood_skin from '../public/images/3d/general/wood-2.jpg';

import TWEEN from 'tween';

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


    camera.position.set(0, 85, 130);
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



    scene.setGravity(new THREE.Vector3(0, -15, 0));
    createGroundAndWalls();


    let colors = ["#2d85f0", "#f4433c", "#ffbc32", "#0aa858"];


    function createGroundAndWalls() {
        let loader = new THREE.TextureLoader();
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            map: loader.load(wood_skin)
        }), .9, .6);

        let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 8, 60), material, 0);
        ground.receiveShadow = true;
        ground.castShadow = true;
        ground.tag = "land";

        let top_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 18, 2), material, 0);
        top_wall.position.set(0, 3, -31);
        top_wall.receiveShadow = true;
        top_wall.castShadow = true;
        ground.add(top_wall);

        let bottom_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(120, 18, 2), material, 0);
        bottom_wall.position.set(0, 3, 31);
        bottom_wall.receiveShadow = true;
        bottom_wall.castShadow = true;
        ground.add(bottom_wall);

        let left_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 18, 64), material, 0);
        left_wall.position.set(-61, 3, 0);
        left_wall.receiveShadow = true;
        left_wall.castShadow = true;
        ground.add(left_wall);

        let right_wall = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 18, 64), material, 0);
        right_wall.position.set(61, 3, 0);
        right_wall.receiveShadow = true;
        right_wall.castShadow = true;
        ground.add(right_wall);

        scene.add(ground);
    }

    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();

    let meshes = [];
    let DatControls = function () {
        this.cubeRestitution = .7;
        this.cubeFriction = .4;
        this.sphereRestitution = .5;
        this.sphereFriction = .1;
    };

    DatControls.prototype.removeAll = function () {
        meshes.forEach(function (e) { scene.remove(e); });
        meshes.length = 0;
    }

    DatControls.prototype.addCube = function () {
        let num = rp([1, 3]);
        for (let i = 0; i < num; i++) {
            let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
                color: new THREE.Color(colors[~~(colors.length * Math.random())])
            }), this.cubeFriction, this.cubeRestitution);
            let cube = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 4, 4), material);
            cube.position.set(rp([-50, 50]), rp([30, 50]), rp([-20, 20]));
            cube.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
            cube.castShadow = true;
            cube.receiveShadow = true;
            meshes.push(cube);
            scene.add(cube);
        }
    }

    DatControls.prototype.addSphere = function () {
        let num = rp([1, 3]);
        for (let i = 0; i < num; i++) {
            let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
                color: new THREE.Color(colors[~~(colors.length * Math.random())])
            }), this.sphereFriction, this.sphereRestitution);
            let sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(2, 10, 10), material);
            sphere.position.set(rp([-50, 50]), rp([30, 50]), rp([-20, 20]));
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            meshes.push(sphere)
            scene.add(sphere);
        }
    }

    let controls = new DatControls();
    let gui = new dat.GUI();

    gui.add(controls, 'cubeRestitution', 0, 1);
    gui.add(controls, 'cubeFriction', 0, 1);
    gui.add(controls, 'sphereRestitution', 0, 1);
    gui.add(controls, 'sphereFriction', 0, 1);
    gui.add(controls, "addCube");
    gui.add(controls, "addSphere");
    gui.add(controls, "removeAll");

    // console.log(TWEEN.Easing)

    let tweenData = { rotate: -0.15 }
    let tweenBegin = new TWEEN.Tween(tweenData).to({ rotate: 0.5 }, 5000);
    tweenBegin.easing(TWEEN.Easing.Quadratic.InOut);
    let tweenEnd = new TWEEN.Tween(tweenData).to({ rotate: -0.5 }, 5000);
    tweenEnd.easing(TWEEN.Easing.Quadratic.InOut);

    tweenBegin.chain(tweenEnd)
    tweenEnd.chain(tweenBegin);

    tweenBegin.start();


    // 碰撞检测
    // mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {});


    ; (function run() {
        let delta = clock.getDelta();
        trackballControls.update(delta);
        stats.update();

        meshes.forEach(mesh => {
            mesh.__dirtyRotation = true;
            mesh.__dirtyPosition = true;
        });

        scene.children.forEach(mesh => {
            if (mesh.tag == "land") {
                TWEEN.update();
                mesh.__dirtyRotation = true;
                mesh.__dirtyPosition = true;
                mesh.rotation.z = tweenData.rotate;
            }
        })

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