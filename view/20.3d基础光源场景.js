import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor } from "../src/untils";
import { createPlane, createWall, createHouse, createTree } from '../src/build';
import grass_pic from "../public/images/3d/grasslight-big.jpg";
import lensflare0 from "../public/images/3d/flares/lensflare0.png"
import lensflare3 from "../public/images/3d/flares/lensflare3.png"
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare"

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);
    let spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    let ambientLight = new THREE.AmbientLight("rgb(195,195,90)", 1);
    let axesHelper = new THREE.AxesHelper(100);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
    window.dispatchEvent(new Event("resize"));

    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-80, 60, 30);
    spotLight.castShadow = true;


    //添加光晕
    let textureFlare0 = new THREE.TextureLoader().load(lensflare0);
    let textureFlare3 = new THREE.TextureLoader().load(lensflare3);
    let flareColor = new THREE.Color(0xffaacc);
    let LensFlare = new Lensflare();
    LensFlare.addElement(new LensflareElement(textureFlare0, 350, 0.0, flareColor));
    LensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6, flareColor));
    LensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7, flareColor));
    LensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9, flareColor));
    LensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0, flareColor));
    spotLight.add(LensFlare);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

    app.append(renderer.domElement);

    scene.add(ambientLight);
    scene.add(spotLight);
    scene.add(axesHelper);

    let planeWidth = 80, planeHeight = 80;
    let wallWidth = 2, wallHeight = 5;

    let grass_skin = new THREE.TextureLoader().load(grass_pic);
    grass_skin.wrapS = THREE.RepeatWrapping;
    grass_skin.wrapT = THREE.RepeatWrapping;
    grass_skin.repeat.set(10, 10);
    let plane = createPlane({ width: planeWidth, height: planeHeight, color: "#C1FFC1", map: grass_skin });
    scene.add(plane);

    let wall_left = createWall({
        width: wallWidth,
        height: wallHeight,
        len: planeWidth,
        color: "#CD950C"
    });
    wall_left.position.set(-planeWidth / 2 + wallWidth / 2, wallHeight / 2, 0);
    scene.add(wall_left);

    let wall_right = wall_left.clone();
    wall_right.position.set(planeWidth / 2 - wallWidth / 2, wallHeight / 2, 0);
    scene.add(wall_right);

    let wall_top = wall_left.clone();
    wall_top.position.set(0, wallHeight / 2, -planeWidth / 2 + wallWidth / 2);
    wall_top.rotation.y = -.5 * Math.PI;
    scene.add(wall_top);

    let wall_bottom = wall_left.clone();
    wall_bottom.position.set(0, wallHeight / 2, planeWidth / 2 - wallWidth / 2);
    wall_bottom.rotation.y = -.5 * Math.PI;
    scene.add(wall_bottom);

    let house = createHouse();
    house.position.set(20, 0, 20);
    scene.add(house);

    let tree_1 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_1.position.set(-24, 0, -8);
    let tree_2 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_2.position.set(0, 0, -8);
    let tree_3 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_3.position.set(24, 0, -8);
    let tree_4 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_4.position.set(-16, 0, -32);
    let tree_5 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_5.position.set(8, 0, -32);
    let tree_6 = createTree({ color: "#FF6EB4", size: rp([8, 12]) });
    tree_6.position.set(32, 0, -32);
    scene.add(...[tree_1, tree_2, tree_3, tree_4, tree_5, tree_6]);


    camera.position.set(-100, 80, 80);
    camera.lookAt(scene.position);

    let stats = initStats();
    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    let DatControls = function () {
        this.intensity = ambientLight.intensity;
        this.disableSpotlight = false;
        this.ambientColor = ambientLight.color.getStyle();

        this.spotlightX = spotLight.position.x;
        this.spotlightY = spotLight.position.y;
        this.spotlightZ = spotLight.position.z;
    }

    let controls = new DatControls();
    let gui = new dat.GUI();

    gui.add(controls, "intensity", 0, 3, 0.1).onChange(e => {
        ambientLight.intensity = e;
    });

    gui.addColor(controls, "ambientColor").onChange(e => {
        ambientLight.color = new THREE.Color(e);
        ambientLight.intensity = controls.intensity;
    });

    gui.add(controls, "disableSpotlight").onChange(
        e => spotLight.visible = !e
    );

    let slv = gui.addFolder("spotlightVector");
    slv.add(controls, "spotlightX", -200, 200).onChange(e => spotLight.position.x = e);
    slv.add(controls, "spotlightY", -200, 200).onChange(e => spotLight.position.y = e);
    slv.add(controls, "spotlightZ", -200, 200).onChange(e => spotLight.position.z = e);


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
