import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp,randomColor } from "../src/untils"


window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, W / H, 0.1, maxZ);
    let light = new THREE.SpotLight(0xffffff,1.2,150,120);
    let amblight = new THREE.AmbientLight(0x3C3C3C);
    let axesHelper = new THREE.AxesHelper(20);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
    window.dispatchEvent(new Event("resize"));

    light.position.set(-40,60,-10);
    light.castShadow = true;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled =true;

    app.append(renderer.domElement);

    let planeGeometry = new THREE.PlaneGeometry(60,40,1,1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color:0xFFFFFF
    })
    let plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.position.set(0,0,0);
    plane.receiveShadow = true;
    plane.rotation.x = -.5*Math.PI;

    scene.add(amblight);
    scene.add(light);
    scene.add(axesHelper);
    scene.add(plane);

    // 场景雾化
    scene.fog = new THREE.FogExp2(0xFFFFFF,0.01);

    // 强制替换场景所有子材质
    // scene.overrideMaterial = new THREE.MeshLambertMaterial({
    //     color:0xFFFFFF
    // })


    camera.position.set(-30,30,30);
    camera.lookAt(scene.position);

    let stats = initStats();

    let DatControls = function(){
        this.numberOfObjects = scene.children.length;
        this.rotationSpeed = 0.02;
    };
    DatControls.prototype.outputObjects = function(){
        console.log(scene.children)
    }
    DatControls.prototype.addCube = function(){
        let len = scene.children.length;
        let size = rp([1,3]);
        let cubeGeometry = new THREE.BoxGeometry(size,size,size);
        let cubeMaterial = new THREE.MeshLambertMaterial({
            color:new THREE.Color(randomColor())
        })
        let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
        let w = plane.geometry.parameters.width;
        let h = plane.geometry.parameters.height;
        cube.castShadow = true;
        cube.name = `cube-${len}`;
        cube.tag = "cube";
        cube.position.x = rp([-w/2,w/2]);
        cube.position.z = rp([-h/2,h/2]);
        cube.position.y = rp([1,5]);
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
        return cube;
    }
    DatControls.prototype.removeCube = function(){
        let len = scene.children.length;
        let lastMesh =scene.children[len-1];
        if(lastMesh instanceof THREE.Mesh && lastMesh.tag == "cube"){
            scene.remove(lastMesh);
            this.numberOfObjects = scene.children.length;
        }
    }

    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls,"addCube");
    gui.add(controls,"removeCube");
    gui.add(controls,"numberOfObjects").listen();
    gui.add(controls,"outputObjects");
    gui.add(controls,"rotationSpeed",0,0.5);

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

    ; (function run() {
        trackballControls.update(clock.getDelta());
        stats.update();

        scene.traverse(obj=>{
            if(obj instanceof THREE.Mesh && obj.tag == "cube"){
                obj.rotation.x += controls.rotationSpeed;
                obj.rotation.y += controls.rotationSpeed;
                obj.rotation.z += controls.rotationSpeed;
            }
        });

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

