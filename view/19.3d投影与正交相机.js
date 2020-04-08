import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor } from "../src/untils"


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    let light = new THREE.SpotLight(0xffffff, 1.2, 250, 320);
    let amblight = new THREE.AmbientLight(0xFFFFFF);
    let axesHelper = new THREE.AxesHelper(100);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
    window.dispatchEvent(new Event("resize"));

    light.shadow.mapSize.height = 2048;
    light.shadow.mapSize.width = 2048;
    light.position.set(-120, 140, 160);
    light.castShadow = true;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

    app.append(renderer.domElement);

    let planeWidth = 180, planeHeight = 180;
    let planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    plane.rotation.x = -.5 * Math.PI;

    for (let i = 0; i < ~~(planeWidth / 5); i++) {
        for (let j = 0; j < ~~(planeHeight / 5); j++) {
            let x = -planeWidth / 2 + i * 5.03 + 2;
            let z = -planeHeight / 2 + j * 5.03 + 2;
            addCube(x, 1, z);
        }
    }

    function addCube(x = 0, y = 1, z = 0) {
        let cube = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), new THREE.MeshPhongMaterial({
            color: new THREE.Color(`rgb(20,${~~rp([85, 155])},20)`)
        }));
        cube.position.set(x, y, z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
    }

    let ball = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 450), new THREE.MeshLambertMaterial({
        color: new THREE.Color("#d5d530")
    }));
    ball.castShadow = true;
    ball.position.set(-planeWidth / 2 + 2, 4, -planeHeight / 2 + 2);
    scene.add(ball);

    scene.add(amblight);
    scene.add(light);
    scene.add(axesHelper);
    scene.add(plane);

    camera.position.set(-120, 60, 180);
    camera.lookAt(ball.position);

    let stats = initStats();
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    let DatControls = function () {
        this.perspective = "Perspective";
        this.speed = 0.05;
        this.disabledLight = false;
    }
    DatControls.prototype.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera = new THREE.OrthographicCamera(-W / 16, W / 16, -H / 16, H / 16, -200, maxZ / 2);
            camera.position.set(-120, 60, 180);
            trackballControls = initTrackballControls(camera, renderer);
            camera.lookAt(ball.position);
            this.perspective = "Orthographic";
        }
        else {
            camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
            camera.position.set(-120, 60, 180);
            camera.lookAt(ball.position);
            trackballControls = initTrackballControls(camera, renderer);
            this.perspective = "Perspective";
        }
    }

    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls, "switchCamera");
    gui.add(controls, "perspective").listen();
    gui.add(controls,"speed",0,0.1,0.01);
    gui.add(controls,"disabledLight").onChange(e=>light.visible = amblight.visible = !e);

    let pointLight = new THREE.PointLight(0xd2d000,1,1000);
    pointLight.intensity = 1.2; //光照强度
    scene.add(pointLight);
    let pointLightHelper= new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);

    let step = 0,invert=1;

    ; (function run() {
        // trackballControls.update(clock.getDelta());
        stats.update();
        // pointLightHelper.update();
        pointLight.position.copy(ball.position);

        // step +=0.02;
        // ball.position.x = Math.cos(step)*planeWidth/2;
        // ball.position.z = Math.sin(step)*planeHeight/2;
        // ball.position.y = 10+4;

        if (step > 2 * Math.PI) {
            invert *= -1;
            step -= 2 * Math.PI;
        } else {
            step += controls.speed;
        }
        
        ball.position.x = Math.cos(step) * planeWidth/4 - planeWidth/4;
        ball.position.z = Math.sin(step) * planeHeight/2;
        ball.position.y = 10;

        if(invert<0){
            ball.position.x *= -1;
        }

        if (camera instanceof THREE.Camera) {
            camera.lookAt(ball.position);
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
