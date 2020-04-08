import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor } from "../src/untils";


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    camera.position.set(-100, 80, 80);
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

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(80, 80, 1, 1), new THREE.MeshStandardMaterial({
        roughness: 0.05,
        metalness: 0
    }))
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0, 0, 0);


    let spotLight = new THREE.SpotLight(0xCCCCCC);

    spotLight.position.set(-40, 60, -10);
    spotLight.intensity = 0.1;
    spotLight.lookAt(scene.position);

    scene.add(...[plane,spotLight]);


    let cubeMaterial1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FF0000")
    });
    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial1);
    cube1.position.set(-15, 15, -40);

    let cubeMaterial2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00FF00")
    });
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial2);
    cube2.position.set(0, 15, -40);

    let cubeMaterial3 = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#0000FF")
    });
    let cube3 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial3);
    cube3.position.set(15, 15, -40);

    let light1 = new THREE.RectAreaLight(cubeMaterial1.color, 500, 4, 10);
    light1.position.copy(cube1.position);
    light1.rotation.x = Math.PI;
    let light2 = new THREE.RectAreaLight(cubeMaterial2.color, 500, 4, 10);
    light2.position.copy(cube2.position);
    light2.rotation.x = Math.PI;
    let light3 = new THREE.RectAreaLight(cubeMaterial3.color, 500, 4, 10);
    light3.position.copy(cube3.position);
    light3.rotation.x = Math.PI;

    scene.add(...[cube1, cube2, cube3]);
    scene.add(...[light1, light2, light3]);

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    let DatControls = function(){
        this.color1 = "#FF0000";
        this.color2 = "#00FF00";
        this.color3 = "#0000FF";
        this.intensity1 = light1.intensity;
        this.intensity2 = light2.intensity;
        this.intensity3 = light3.intensity;
    };
    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.addColor(controls,"color1").onChange(e=>{
        light1.color = cubeMaterial1.color = new THREE.Color(e);
        scene.remove(cube1);
        cube1 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial1);
        cube1.position.copy(light1.position);
        scene.add(cube1);
    });
    gui.add(controls,"intensity1",0,1000).onChange(e=>{
        light1.intensity = e;
    });

    gui.addColor(controls,"color2").onChange(e=>{
        light2.color = cubeMaterial2color = new THREE.Color(e);
        scene.remove(cube2);
        cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial12);
        cube2.position.copy(light2.position);
        scene.add(cube2);
    });
    gui.add(controls,"intensity2",0,1000).onChange(e=>{
        light2.intensity = e;
    });

    gui.addColor(controls,"color3").onChange(e=>{
        light3.color = cubeMaterial3.color = new THREE.Color(e);
        scene.remove(cube3);
        cube3 = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 0), cubeMaterial3);
        cube3.position.copy(light3.position);
        scene.add(cube3);
    });
    gui.add(controls,"intensity3",0,1000).onChange(e=>{
        light3.intensity = e;
    });

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
