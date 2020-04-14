import * as THREE from 'three';
import "../public/src/TrackballControls";
import Stats from '../public/src/Stats';
import dat from "../public/src/dat.gui";
import { rp, randomColor, loadImg } from "../src/untils";

window.addEventListener("load", init);

function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1500;
    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, W / H, 0.1, maxZ);

    camera.position.set(0, 0, 200);
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

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();
    let stats = initStats();

    let knot;

    let DatControls = function(){
        this.radius = 1;
        this.tube = 70;
        this.radialSegments = 120;
        this.tubularSegments = 35;
        this.p = 9.9;
        this.q = 5;
        this.asParticles = true;
        this.rotate = true;
    };
    DatControls.prototype.redraw = function(){
        if(knot) scene.remove(knot);
        let geom = new THREE.TorusKnotGeometry(controls.radius,controls.tube,controls.tubularSegments,controls.radialSegments,controls.p,controls.q);
        if(controls.asParticles){
            knot = createPoints(geom)
        }
        else{
            knot = new THREE.Mesh(geom,new THREE.MeshNormalMaterial()); 
        }
        scene.add(knot);
    }
    let controls = new DatControls();
    let gui = new dat.GUI();

    gui.add(controls,"radius",1,200).onChange(()=>controls.redraw());
    gui.add(controls,"tube",1,200).onChange(()=>controls.redraw());
    gui.add(controls,"radialSegments",10,500).onChange(()=>controls.redraw());
    gui.add(controls,"tubularSegments",10,500).onChange(()=>controls.redraw());
    gui.add(controls,"p",1,50).onChange(()=>controls.redraw());
    gui.add(controls,"q",1,50).onChange(()=>controls.redraw());
    gui.add(controls,"asParticles").onChange(()=>controls.redraw());
    gui.add(controls,"rotate");

    controls.redraw();

    function generateSprite() {
        let canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        let context = canvas.getContext('2d');
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
    
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      }

      function createPoints(geom) {
        let material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 3,
          transparent: true,
          blending: THREE.AdditiveBlending,
          map: generateSprite(),
          depthWrite: false
        });
    
        return new THREE.Points(geom, material);
      }

      let step = 0;

    ; (function run() {
        trackballControls.update(clock.getDelta());
        stats.update();

        if(controls.rotate){
            knot.rotation.y = step+=0.01;
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
