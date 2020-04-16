import * as THREE from 'three';
require("../public/src/TrackballControls")
import {
    Scene, PerspectiveCamera, WebGLRenderer,
    SpotLight, PlaneGeometry, AxesHelper,
    Mesh, BoxGeometry, SphereGeometry, Color, Vector2,
    TextureLoader, MeshLambertMaterial, Clock
} from 'three';
require("three/examples/js/renderers/Projector")


import skin_cube from '../public/images/3d/crate.gif';
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new WebGLRenderer();
    let scene = new Scene();
    let camera = new PerspectiveCamera(45, W / H, 0.1, maxZ);
    let light = new SpotLight(0xffffff);
    let axesHelper = new AxesHelper(20);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });

    window.dispatchEvent(new Event("resize"));

    light.castShadow = true;
    light.shadow.camera.far = 130;
    light.shadow.camera.near = 40;
    light.shadow.mapSize = new Vector2(2048, 2048);
    light.position.set(-40, 60, 0);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new Color(0x333333));
    renderer.shadowMap.enabled = true;

    app.append(renderer.domElement);

    let planeGeometry = new PlaneGeometry(60, 20);
    let planeMaterial = new MeshLambertMaterial({
        color: 0xDDDDDD
    });

    let plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(10, 0, 0);
    plane.receiveShadow = true;

    let texture = new TextureLoader().load(skin_cube);
    let cube = new Mesh(new BoxGeometry(4, 4, 4), new MeshLambertMaterial({
        color: 0xFFFFFF,
        map: texture,
        // wireframe: true
    }));
    cube.position.set(-7, 10, 0);
    cube.castShadow = true;

    let sphere = new Mesh(new SphereGeometry(2, 20, 20), new MeshLambertMaterial({
        color: 0xA367E7,
        // wireframe: true
    }));
    sphere.position.set(20, 2, 0);
    sphere.castShadow = true;

    scene.add(light);
    scene.add(axesHelper);
    scene.add(plane);
    scene.add(cube);
    scene.add(sphere);

    camera.position.set(-30, 30, 30);
    camera.lookAt(scene.position);


    let projector =new THREE.Projector();
    app.addEventListener("mousedown",function(e){
        let v3 = new THREE.Vector3((e.clientX/W)*2-1,-(e.clientY/H)*2+1,0.5);
        v3 = v3.unproject(camera);
        let raycaster = new THREE.Raycaster(camera.position,v3.sub(camera.position).normalize());
        let intersects = raycaster.intersectObjects([sphere,cube])
        if(intersects.length>0){
            intersects[0].object.material.transparent = !intersects[0].object.material.transparent;
            intersects[0].object.material.opacity = intersects[0].object.material.opacity == 1 ? 0.5:1;
        }
    },false)
    


    let stats = initStats();
    let step = 0;

    let controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.enabled = false;
    }

    let gui = new dat.GUI();
    gui.add(controls, "rotationSpeed", 0, 0.5);
    gui.add(controls, "bouncingSpeed", 0, 0.5);
    gui.add(controls, "enabled");

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new Clock();

    ; (function run() {
        trackballControls.update(clock.getDelta());
        trackballControls.enabled = controls.enabled;
        stats.update();

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + 10 * Math.cos(step);
        sphere.position.y = sphere.geometry.parameters.radius + 10 * Math.abs(Math.sin(step));

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

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
        trackballControls.staticMoving = false;
        trackballControls.dynamicDampingFactor = 0.3;
        trackballControls.keys = [65, 83, 68];
        console.log(trackballControls)
        return trackballControls;
    }

}

