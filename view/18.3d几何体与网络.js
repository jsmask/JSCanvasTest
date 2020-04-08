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
    let camera = new THREE.PerspectiveCamera(45, W / H, 0.1, maxZ);
    let light = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
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

    light.shadow.mapSize.height = 2048;
    light.shadow.mapSize.width = 2048;
    light.position.set(-40, 60, -10);
    light.castShadow = true;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.shadowMap.enabled = true;

    app.append(renderer.domElement);

    let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF
    })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    plane.rotation.x = -.5 * Math.PI;

    let vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];

    let faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    let geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();



    let materials = [
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
        new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true })
    ];


    function createMultiMaterialObject(geometry, materials) {
        var group = new THREE.Group();
        for (var i = 0, l = materials.length; i < l; i++) {
            group.add(new THREE.Mesh(geometry, materials[i]));
        }
        return group;
    }

    let mesh = createMultiMaterialObject(geom, materials);
    mesh.position.set(0,1,0);


    mesh.castShadow = true;
    mesh.children.forEach(function (e) {
        e.castShadow = true;
    });

    scene.add(mesh);

    scene.add(amblight);
    scene.add(light);
    scene.add(axesHelper);
    scene.add(plane);

    camera.position.set(-30, 30, 30);
    camera.lookAt(scene.position);

    let stats = initStats();

    let DatControls = function () {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

    };

    DatControls.prototype.clone = function () {
        let cloneGeom = mesh.children[0].geometry.clone();
        let materials = [
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: new THREE.Color(randomColor()), transparent: true })
        ];
        let mesh2 = createMultiMaterialObject(cloneGeom, materials);
        mesh2.position.x = rp([-60 / 2, 60 / 2]);
        mesh2.position.z = rp([-40 / 2, 40 / 2]);
        mesh2.position.y = mesh.position.y;
        mesh2.name = "clone";
        mesh2.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
        scene.remove(scene.getChildByName("clone"));
        scene.add(mesh2);
    }
    DatControls.prototype.changeTranslate = function(){
        mesh.translateX(controls.translateX);
        mesh.translateY(controls.translateY);
        mesh.translateZ(controls.translateZ);
    }

    let controls = new DatControls();
    let gui = new dat.GUI();
    gui.add(controls, "clone");

    for (var i = 0; i < 8; i++) {
        let f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(vertices[i], 'x', -10, 10);
        f1.add(vertices[i], 'y', -10, 10);
        f1.add(vertices[i], 'z', -10, 10);
    }

    let f2 = gui.addFolder("rotation");
    f2.add(controls, 'rotationX', -4, 4);
    f2.add(controls, 'rotationY', -4, 4);
    f2.add(controls, 'rotationZ', -4, 4);

    let f3 = gui.addFolder("scale");
    f3.add(controls, "scaleX", 1, 5);
    f3.add(controls, "scaleY", 1, 5);
    f3.add(controls, "scaleZ", 1, 5);

    let f4 = gui.addFolder("position");
    let tlx = f4.add(controls, "positionX", -15, 15);
    let tly = f4.add(controls, "positionY", -15, 15);
    let tlz = f4.add(controls, "positionZ", -15, 15);
    tlx.listen().onChange(val=>mesh.position.x=val);
    tly.listen().onChange(val=>mesh.position.y=val);
    tlz.listen().onChange(val=>mesh.position.z=val);

    let f5 = gui.addFolder("translate");
    f5.add(controls,"translateX",-10,10);
    f5.add(controls,"translateY",-10,10);
    f5.add(controls,"translateZ",-10,10);
    f5.add(controls,"changeTranslate");

    gui.add(controls,"visible");

    let trackballControls = initTrackballControls(camera, renderer);
    let clock = new THREE.Clock();

        ; (function run() {
            trackballControls.update(clock.getDelta());
            stats.update();

            mesh.children.forEach(function (e) {
                e.geometry.vertices = vertices;
                e.geometry.verticesNeedUpdate = true;
                e.geometry.computeFaceNormals();
                delete e.geometry.__directGeometry
            });

            mesh.rotation.set(controls.rotationX, controls.rotationY, controls.rotationZ);
            mesh.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
            mesh.visible = controls.visible;

            addLine();

            requestAnimationFrame(run);
            renderer.render(scene, camera);
        })();


    function addLine() {
        let wireframe = new THREE.WireframeGeometry(geom);
        let line = new THREE.LineSegments(wireframe);
        line.material.linewidth = 2;
        line.material.color = new THREE.Color("#ffffff");
        line.name = "line";
        scene.remove(scene.getObjectByName("line"));
        line.scale.set(2 * mesh.scale.x, 2 * mesh.scale.y, 2 * mesh.scale.z)
        line.position.y += 12;
        line.rotation.set(controls.rotationX, controls.rotationY, controls.rotationZ);
        scene.add(line);
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
