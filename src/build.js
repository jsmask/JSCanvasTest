import * as THREE from 'three';


function createMultiMaterialObject(geometry, materials) {
    var group = new THREE.Group();
    for (var i = 0, l = materials.length; i < l; i++) {
        group.add(new THREE.Mesh(geometry, materials[i]));
    }
    return group;
}

module.exports = {
    createPlane(args) {
        let obj = {
            width: 80,
            height: 80,
            color: "#E8E8E8",
            map: null
        }
        obj = Object.assign(obj, args);
        let { color, width, height, map } = obj;
        let plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            map
        }));
        plane.position.set(0, 0, 0);
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        return plane;
    },
    createWall(args) {
        let obj = {
            width: 2,
            height: 2,
            len: 80,
            color: "#CD950C"
        }
        obj = Object.assign(obj, args);
        let { color, width, height, len } = obj;
        let wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, len), new THREE.MeshPhongMaterial({
            color: new THREE.Color(color)
        }));
        wall.receiveShadow = true;
        wall.castShadow = true;
        return wall;
    },
    createHouse() {
        let house = new THREE.Group();
        var base = new THREE.BoxGeometry(12, 10, 18);
        let vertices = [
            new THREE.Vector3(4, 3, 10),
            new THREE.Vector3(4, 3, -10),
            new THREE.Vector3(6, -1, 10),
            new THREE.Vector3(6, -1, -10),
            new THREE.Vector3(-4, 3, -10),
            new THREE.Vector3(-4, 3, 10),
            new THREE.Vector3(-6, -1, -10),
            new THREE.Vector3(-6, -1, 10)
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

        let roof = new THREE.Geometry();
        roof.vertices = vertices;
        roof.faces = faces;

        let roofMesh = new THREE.Mesh(roof, new THREE.MeshLambertMaterial({
            color: new THREE.Color("#CD2626")
        }
        ));

        var baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({
            color: new THREE.Color("#D6D6D6")
        }));


        roofMesh.position.set(0, 11, 0);
        baseMesh.position.set(0, 5, 0);

        roofMesh.receiveShadow = true;
        baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        house.add(roofMesh);
        house.add(baseMesh);
        return house;
    },
    createTree(args) {
        let obj = {
            size: 8,
            color: "#2E8B57"
        }
        obj = Object.assign(obj, args);
        let { color, size } = obj;
        let tree = new THREE.Group();
        let baseMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.5, 20),
            new THREE.MeshPhongMaterial({
                color: new THREE.Color("#8B4726")
            })
        );
        let leavesMesh = new THREE.Mesh(
            new THREE.SphereGeometry(size),
            new THREE.MeshPhongMaterial({
                color: new THREE.Color(color)
            })
        );
        baseMesh.receiveShadow = true;
        baseMesh.castShadow = true;
        baseMesh.position.set(0, 10, 0);

        leavesMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        leavesMesh.position.set(0, 10 + size - 2, 0)

        tree.add(baseMesh);
        tree.add(leavesMesh);

        return tree;
    }
}