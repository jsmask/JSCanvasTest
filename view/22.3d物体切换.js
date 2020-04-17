import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { setMaterialGroup } from "../src/untils";
import floor_wood from '../public/images/3d/general/floor-wood.jpg';
import cube_wood from "../public/images/3d/crate.gif";
import sphere_lava from '../public/images/3d/emissive/lava.png';
import sphere_normal_lava from '../public/images/3d/emissive/lava-normals.png';
import sphere_metalness_lava from '../public/images/3d/emissive/lava-smoothness.png';
import plane_wood from '../public/images/3d/general/wood-2.jpg';
import gopher_obj from "../public/models/gopher/gopher.obj";
require('three/examples/js/loaders/OBJLoader');

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    camera.position.set(-150, 80, 100);
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

    //普通光源
    let ambLight = new THREE.AmbientLight(0xfcfcfc);
    scene.add(ambLight);

    //普通光源
    let spotLight = new THREE.SpotLight(0xcccc1c, 1);
    let spotHelper = new THREE.SpotLightHelper(spotLight);
    spotLight.position.set(-180, 180, 60);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);
    scene.add(spotHelper);

    //地板
    let floor_skin = new THREE.TextureLoader().load(floor_wood);
    floor_skin.wrapS = THREE.RepeatWrapping;
    floor_skin.wrapT = THREE.RepeatWrapping;
    floor_skin.repeat.set(1, 1);
    let floor = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FFFFFF"),
        map: floor_skin,
        metalness:0.2, //金属感程度
        roughness:1  //粗糙程度
    }));
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.set(0, 0, 0);
    scene.add(floor);

    //木箱
    let cube_skin = new THREE.TextureLoader().load(cube_wood);
    let cube = new THREE.Mesh(new THREE.BoxGeometry(25, 25, 25), new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: cube_skin
    }));
    cube.receiveShadow = true;
    cube.castShadow = true;
    cube.position.set(0, 40, 0);
    // scene.add(cube);

    //岩浆球体
    let sphere_skin = new THREE.TextureLoader().load(sphere_lava);
    let sphere_normal_skin = new THREE.TextureLoader().load(sphere_normal_lava);
    let sphere_metalness_skin = new THREE.TextureLoader().load(sphere_metalness_lava);
    let sphere = new THREE.Mesh(new THREE.SphereGeometry(15,50,50), new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        emissive: 0xFFFFFF,
        emissiveMap: sphere_skin,
        normalMap:sphere_normal_skin,
        // metalnessMap: sphere_metalness_skin,
        metalness: 1,
        roughness:0.4,
        normalScale: new THREE.Vector2(4,4)
    }));
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.position.set(0, 40, 0);
    // scene.add(sphere);

    //木片平面
    let plane_skin = new THREE.TextureLoader().load(plane_wood);
    let plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        map: plane_skin,
        flatShading: true,
        side:THREE.DoubleSide
    }));
    plane.receiveShadow = true;
    plane.castShadow = true;
    plane.position.set(0, 40, 0);
    // scene.add(plane);

    //地鼠模型
    function loadGopher() {
        let loader = new THREE.OBJLoader();
        return new Promise((resolve, reject) => {
            loader.load(gopher_obj, mesh => {
                computeNormalsGroup(mesh);
                setMaterialGroup(new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color("#885244"),
                    // metalness:0.7, //金属感程度
                    // roughness:0,   //粗糙程度
                    clearcoat:0.7, //清漆
                    clearcoatRoughness: 0.3, //清漆粗糙程度
                    reflectivity:1 //反光度
                }), mesh);
                resolve(mesh)
            });
        })
    }

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    let DatControls = function () {
        this.selectedMesh = "木箱";
        this.lightIntensity = 1;
    };
    let controls = new DatControls();
    let gui = new dat.GUI();

    let mainMesh = cube;
    scene.add(mainMesh);

    spotLight.intensity = controls.lightIntensity;
    gui.add(controls,"lightIntensity",0,2,0.01).onChange(e=>{
        spotLight.intensity = e
    })

    loadGopher().then(gopher => {
        gopher.position.set(0, 25, 0);
        gopher.rotation.y = Math.PI;
        gopher.scale.set(5,5,5);
        // scene.add(gopher);

        gui.add(controls, "selectedMesh", ["木箱", "熔岩球", "木片", "地鼠模型"]).onChange(val => {
            scene.remove(mainMesh);

            switch (val) {
                case "木箱":
                    mainMesh = cube;
                    break;
                case "熔岩球":
                    mainMesh = sphere;
                    break;
                case "木片":
                    mainMesh = plane;
                    break;
                case "地鼠模型":
                    mainMesh = gopher;
                    break;
                default:
                    break;
            }

            scene.add(mainMesh)
        })
    });

    


    ; (function run() {
        trackballControls.update(clock.getDelta());
        stats.update();

        if(mainMesh) mainMesh.rotation.y += 0.03;

        requestAnimationFrame(run);
        renderer.render(scene, camera);
    })();


    function computeNormalsGroup(group) {
        if (group instanceof THREE.Mesh) {
            let tempGeom = new THREE.Geometry();
            tempGeom.fromBufferGeometry(group.geometry)
            tempGeom.computeFaceNormals();
            tempGeom.mergeVertices();
            tempGeom.computeVertexNormals();
            tempGeom.normalsNeedUpdate = true;
            group.geometry = tempGeom;

        } else if (group instanceof THREE.Group) {
            group.children.forEach(function (child) { computeNormalsGroup(child) });
        }
    }

    function setMaterialGroup(material, group, isShadow = true) {
        if (group instanceof THREE.Mesh) {
            group.material = material;
        } else if (group instanceof THREE.Group) {
            group.children.forEach(function (child) {
                if (isShadow) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
                setMaterialGroup(material, child)
            });
        }
    }

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
