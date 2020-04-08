import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, PointLight} from 'three';
import skin from "../public/images/3d/crate.gif";

window.addEventListener("load", init);


function init() {
    const app = document.getElementById("app");
    let W, H, maxZ = 1000;
    let renderer = new WebGLRenderer();
    let scene = new Scene();
    let camera = new PerspectiveCamera(75, W / H, 1, maxZ);
    let light = new PointLight(0xffffff);

    window.addEventListener("resize", () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
    window.dispatchEvent(new Event("resize"));
    camera.position.z = 400;
    light.position.copy(camera.position);
    scene.add(light);
    renderer.setPixelRatio(window.devicePixelRatio);

    app.append(renderer.domElement);

    let texture = new TextureLoader().load(skin);
    let geometry = new BoxGeometry(200, 200, 200);
    let material = new MeshBasicMaterial({
        color: "#ffffff",
        map: texture
    })
    let cube = new Mesh(geometry, material);

    scene.add(cube);

    window.addEventListener("wheel", e => {
        camera.position.z += e.deltaY * 0.1;
        camera.position.z = Math.max(0, Math.min(camera.position.z, maxZ));
    })

        ; (function run() {
            requestAnimationFrame(run);
            cube.rotation.x += 0.008;
            cube.rotation.y -= 0.02;
            renderer.render(scene, camera);
        })();
}

