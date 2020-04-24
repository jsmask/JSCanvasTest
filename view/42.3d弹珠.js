
import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";
require("three/examples/js/controls/TrackballControls");

import wood_skin from '../public/images/3d/general/wood-2.jpg';

require("../public/src/physi");

const Physijs = window.Physijs;
// Physijs.scripts.worker
// Physijs.scripts.ammo

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new Physijs.Scene({ reportSize: 10, fixedTimeStep: 1 / 60 });
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    renderer.autoClear = false;

    let ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xcFcF56, 1);
    spotLight.position.set(-50, 120, 90)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    scene.add(spotLight);

    // let spotHelper= new THREE.SpotLightHelper(spotLight);
    // scene.add(spotHelper);

    camera.position.set(0, 95, 70);
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


    createMainBox();
    createRubBox(10, -25, -.5, 10, 10);
    createRubBox(-10, -5, .3);
    createRubBox(22, 8, .7, 18, 2);
    createRubBox(-22, 15, -.15);

    let flipperLeftConstraint = createFlipLeft();
    let flipperRightConstraint = createFlipRight();


    let trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    let clock = new THREE.Clock();
    let stats = initStats();

    let balls = [];
    let DatControls = function () {
        this.velocity = 5;
        this.acceleration = 20;
    };
    DatControls.prototype.addBall = function () {
        let colors = ["#2d85f0", "#f4433c", "#ffbc32", "#0aa858"];
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: new THREE.Color(colors[~~(colors.length * Math.random())])
        }), 0, 0);
        let ball = new Physijs.SphereMesh(new THREE.SphereGeometry(2, 20, 20), material, 0.001);
        ball.name = "ball";
        ball.position.set(rp([-25, 25]), 5, -40);
        ball.castShadow = true;
        ball.receiveShadow = true;
        balls.push(ball);
        scene.add(ball);
    }
    DatControls.prototype.removeBall = function () {
        balls.forEach(ball => scene.remove(ball));
        balls.length = 0;
    }
    DatControls.prototype.flipUp = function () {
        flipperLeftConstraint.enableAngularMotor(this.velocity * 1000, this.acceleration * 1000);
        flipperRightConstraint.enableAngularMotor(-1 * this.velocity * 1000, this.acceleration * 1000);
    }
    DatControls.prototype.flipDown = function () {
        flipperLeftConstraint.enableAngularMotor(-1 * this.velocity * 1000, this.acceleration * 1000);
        flipperRightConstraint.enableAngularMotor(this.velocity * 1000, this.acceleration * 1000);
    }
    scene.setGravity(new THREE.Vector3(0, -100, 50))

    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls, "addBall");
    gui.add(controls, "removeBall");

    gui.add(controls, "flipUp");
    gui.add(controls, "flipDown");

    let isUp = false;

    window.addEventListener("keyup", e => {
        switch (e.keyCode) {
            case 32:
                if (!isUp)
                    controls.flipUp();
                else
                    controls.flipDown();
                isUp = !isUp;
                break;
            case 8:
                controls.removeBall();
                break;
            case 187:
                controls.addBall();
                break;
            default:
                break;
        }
    })

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


    function createMainBox() {
        let loader = new THREE.TextureLoader();
        let map = loader.load(wood_skin);
        let ground_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0x999999,
            map,
        }), .9, .7);
        let wall_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: .1,
        }), .9, .7)
        let ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 100), ground_material, 0);
        ground.position.set(0, 0, 0);
        ground.receiveShadow = true;
        ground.castShadow = true;
        scene.add(ground);

        let wallLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 150, 100), wall_material, 0);
        wallLeft.position.set(-30.5, 74, 0);
        scene.add(wallLeft);

        let wallRight = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 150, 100), wall_material, 0);
        wallRight.position.set(30.5, 74, 0);
        scene.add(wallRight);

        let wallTop = new Physijs.BoxMesh(new THREE.BoxGeometry(61, 150, 1), wall_material, 0);
        wallTop.position.set(0, 74, -50.5);
        scene.add(wallTop);

        let wallBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(61, 150, 1), wall_material, 0);
        wallBottom.position.set(0, 74, 50.5);
        scene.add(wallBottom);
    }

    function createRubBox(x = 0, z = 0, rotate, w = 15, h = 2) {
        let geometry = new THREE.BoxGeometry(w, 4, h);
        let loader = new THREE.TextureLoader();
        let map = loader.load(wood_skin);
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xAAAAAA,
            map
        }), 1, 1);
        let box = new Physijs.BoxMesh(geometry, material, 0);
        box.position.y = 2;
        box.position.x = x;
        box.position.z = z;
        box.castShadow = true;
        box.receiveShadow = true;
        box.rotation.y = rotate;
        scene.add(box);
    }

    function createFlipLeft() {
        let loader = new THREE.TextureLoader();
        let map = loader.load(wood_skin);
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xAAAAAA,
            map
        }), 0, 0);

        let flip = new Physijs.BoxMesh(new THREE.BoxGeometry(18, 4, 2), material, 10);
        flip.castShadow = true;
        flip.receiveShadow = true;
        flip.position.set(-10, 2, 36);
        scene.add(flip);

        let pivot = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 4, 2), material, 0);
        pivot.castShadow = true;
        pivot.receiveShadow = true;
        pivot.position.set(-22, 2, 36);
        pivot.rotation.y = 1.4;
        scene.add(pivot);

        let constraint = new Physijs.HingeConstraint(flip, pivot, pivot.position, new THREE.Vector3(0, 1, 0));
        scene.addConstraint(constraint);

        constraint.setLimits(
            -2.2, // 从对象1开始（返回）的最小运动角度（弧度）
            -0.6, // 从对象1开始（向前）的最大运动角度（弧度）
            0.3, // 作为约束误差的一个因素，当一个约束被击中时kantelpunt被移动了多大
            0.5 // 控制限制反弹（0.0==无反弹）
        );

        return constraint;
    }

    function createFlipRight() {
        let loader = new THREE.TextureLoader();
        let map = loader.load(wood_skin);
        let material = Physijs.createMaterial(new THREE.MeshStandardMaterial({
            color: 0xAAAAAA,
            map
        }), 0, 0);

        let flip = new Physijs.BoxMesh(new THREE.BoxGeometry(18, 4, 2), material, 10);
        flip.castShadow = true;
        flip.receiveShadow = true;
        flip.position.set(10, 2, 36);
        scene.add(flip);

        let pivot = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 4, 2), material, 0);
        pivot.castShadow = true;
        pivot.receiveShadow = true;
        pivot.position.set(22, 2, 36);
        pivot.rotation.y = 1.4;
        scene.add(pivot);

        let constraint = new Physijs.HingeConstraint(flip, pivot, pivot.position, new THREE.Vector3(0, 1, 0));
        scene.addConstraint(constraint);

        constraint.setLimits(
            -2.2, // 从对象1开始（返回）的最小运动角度（弧度）
            -0.6, // 从对象1开始（向前）的最大运动角度（弧度）
            0.3, // 作为约束误差的一个因素，当一个约束被击中时kantelpunt被移动了多大
            0.5 // 控制限制反弹（0.0==无反弹）
        );

        return constraint;
    }

}