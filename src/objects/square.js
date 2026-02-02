
import * as THREE from 'three';

const SQUARE_X = -80; // South side (negative X = south bank)
const SQUARE_Z = 0;

export function createMacedoniaSquare() {
    const squareGroup = new THREE.Group();
    squareGroup.name = 'MacedoniaSquare';

    // ---- PLAZA SURFACE ----
    const plaza = createPlaza();
    squareGroup.add(plaza);

    // ---- WARRIOR ON HORSE MONUMENT ----
    const monument = createWarriorMonument();
    squareGroup.add(monument);

    // ---- NEOCLASSICAL BUILDINGS ----
    const buildings = createSquareBuildings();
    squareGroup.add(buildings);

    // ---- PORTA MACEDONIA (Triumphal Arch) ----
    const arch = createPortaMacedonia();
    squareGroup.add(arch);

    // ---- STREET FURNITURE ----
    const furniture = createStreetFurniture();
    squareGroup.add(furniture);

    // ---- TREES along the square ----
    const trees = createSquareTrees();
    squareGroup.add(trees);

    squareGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return squareGroup;
}

function createPlaza() {
    const group = new THREE.Group();

    // Main plaza - light stone/marble paving
    const plazaGeo = new THREE.PlaneGeometry(100, 100);
    const plazaMat = new THREE.MeshStandardMaterial({
        color: 0xC8C0B0,
        roughness: 0.7,
        metalness: 0.05
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.set(SQUARE_X, 2.1, SQUARE_Z);
    group.add(plazaMesh);

    // Decorative circular pattern in center
    const circleGeo = new THREE.CircleGeometry(20, 32);
    const circleMat = new THREE.MeshStandardMaterial({
        color: 0xD8D0C0,
        roughness: 0.6,
        metalness: 0.08
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.set(SQUARE_X, 2.15, SQUARE_Z);
    group.add(circle);

    // Inner ring
    const ringGeo = new THREE.RingGeometry(12, 13, 32);
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0xA09888,
        roughness: 0.7
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(SQUARE_X, 2.18, SQUARE_Z);
    group.add(ring);

    return group;
}

function createWarriorMonument() {
    const group = new THREE.Group();
    group.name = 'WarriorMonument';

    // Circular fountain basin
    const basinGeo = new THREE.CylinderGeometry(10, 11, 2, 24);
    const basinMat = new THREE.MeshStandardMaterial({
        color: 0xB8B0A0,
        roughness: 0.5,
        metalness: 0.1
    });
    const basin = new THREE.Mesh(basinGeo, basinMat);
    basin.position.set(SQUARE_X, 3, SQUARE_Z);
    group.add(basin);

    // Inner basin (water)
    const waterGeo = new THREE.CylinderGeometry(9, 9, 0.3, 24);
    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x3A7A8A,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1,
        metalness: 0.1
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(SQUARE_X, 3.8, SQUARE_Z);
    group.add(water);

    // Tall pedestal/column
    const pedestalGeo = new THREE.CylinderGeometry(3, 3.5, 18, 12);
    const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0xD0C8B8,
        roughness: 0.4,
        metalness: 0.15
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(SQUARE_X, 13, SQUARE_Z);
    group.add(pedestal);

    // Decorative rings on pedestal
    for (let y = 6; y <= 20; y += 4) {
        const ringGeo = new THREE.TorusGeometry(3.2, 0.3, 8, 16);
        const ring = new THREE.Mesh(ringGeo, pedestalMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(SQUARE_X, y, SQUARE_Z);
        group.add(ring);
    }

    // Horse body (simplified sculptural form)
    const horseMat = new THREE.MeshStandardMaterial({
        color: 0xC8A050, // Bronze/gold color
        roughness: 0.35,
        metalness: 0.7
    });

    // Horse torso
    const torsoGeo = new THREE.BoxGeometry(2.5, 2.5, 5);
    const torso = new THREE.Mesh(torsoGeo, horseMat);
    torso.position.set(SQUARE_X, 23.5, SQUARE_Z);
    torso.rotation.y = Math.PI / 2; // facing south
    group.add(torso);

    // Horse head/neck
    const neckGeo = new THREE.CylinderGeometry(0.6, 0.8, 3, 6);
    const neck = new THREE.Mesh(neckGeo, horseMat);
    neck.position.set(SQUARE_X, 25, SQUARE_Z + 2.5);
    neck.rotation.x = -0.5;
    group.add(neck);

    const headGeo = new THREE.BoxGeometry(0.8, 1.2, 1.5);
    const head = new THREE.Mesh(headGeo, horseMat);
    head.position.set(SQUARE_X, 26.5, SQUARE_Z + 3.5);
    group.add(head);

    // Horse legs (4)
    const legPositions = [
        { x: -0.8, z: -1.5 }, { x: 0.8, z: -1.5 },
        { x: -0.8, z: 1.5 }, { x: 0.8, z: 1.5 }
    ];
    legPositions.forEach((pos, i) => {
        const legGeo = new THREE.CylinderGeometry(0.25, 0.3, 3, 5);
        const leg = new THREE.Mesh(legGeo, horseMat);
        leg.position.set(
            SQUARE_X + pos.x,
            22,
            SQUARE_Z + pos.z
        );
        // Front legs rearing up
        if (i >= 2) {
            leg.rotation.x = 0.4;
            leg.position.y = 22.5;
        }
        group.add(leg);
    });

    // Rider (simplified)
    const riderTorsoGeo = new THREE.CylinderGeometry(0.5, 0.6, 2.5, 6);
    const rider = new THREE.Mesh(riderTorsoGeo, horseMat);
    rider.position.set(SQUARE_X, 25.5, SQUARE_Z);
    group.add(rider);

    // Rider arm with sword (raised)
    const swordGeo = new THREE.CylinderGeometry(0.06, 0.06, 4, 4);
    const sword = new THREE.Mesh(swordGeo, horseMat);
    sword.position.set(SQUARE_X + 0.8, 28, SQUARE_Z);
    sword.rotation.z = 0.3;
    group.add(sword);

    // Horse tail
    const tailGeo = new THREE.CylinderGeometry(0.15, 0.08, 2.5, 4);
    const tail = new THREE.Mesh(tailGeo, horseMat);
    tail.position.set(SQUARE_X, 23.5, SQUARE_Z - 3.5);
    tail.rotation.x = 0.5;
    group.add(tail);

    return group;
}

function createSquareBuildings() {
    const group = new THREE.Group();

    // Neoclassical building materials
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0xE8E0D0,
        roughness: 0.6,
        metalness: 0.05
    });
    const darkWallMat = new THREE.MeshStandardMaterial({
        color: 0xD0C8B8,
        roughness: 0.65,
        metalness: 0.05
    });
    const roofMat = new THREE.MeshStandardMaterial({
        color: 0x5A4A3A,
        roughness: 0.8,
        metalness: 0.1
    });
    const windowMat = new THREE.MeshStandardMaterial({
        color: 0x4A6A8A,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.5
    });

    // Government building - left of square (Archaeological Museum style)
    const govBuilding = createNeoclassicalBuilding(60, 18, 25, wallMat, roofMat, windowMat);
    govBuilding.position.set(SQUARE_X - 20, 2, SQUARE_Z - 55);
    group.add(govBuilding);

    // Building right of square
    const rightBuilding = createNeoclassicalBuilding(50, 15, 20, darkWallMat, roofMat, windowMat);
    rightBuilding.position.set(SQUARE_X - 20, 2, SQUARE_Z + 55);
    group.add(rightBuilding);

    // Building behind square (further south)
    const backBuilding = createNeoclassicalBuilding(70, 20, 20, wallMat, roofMat, windowMat);
    backBuilding.position.set(SQUARE_X - 55, 2, SQUARE_Z);
    backBuilding.rotation.y = Math.PI / 2;
    group.add(backBuilding);

    // Smaller buildings
    for (let i = 0; i < 4; i++) {
        const bld = createSimpleBuilding(
            15 + Math.random() * 15,
            10 + Math.random() * 8,
            12 + Math.random() * 10,
            wallMat, roofMat
        );
        bld.position.set(
            SQUARE_X - 60 - Math.random() * 30,
            2,
            SQUARE_Z + (i - 1.5) * 35
        );
        group.add(bld);
    }

    return group;
}

function createNeoclassicalBuilding(width, height, depth, wallMat, roofMat, windowMat) {
    const building = new THREE.Group();

    // Main body
    const bodyGeo = new THREE.BoxGeometry(depth, height, width);
    const body = new THREE.Mesh(bodyGeo, wallMat);
    body.position.y = height / 2;
    building.add(body);

    // Columns along front facade
    const columnCount = Math.floor(width / 6);
    for (let i = 0; i < columnCount; i++) {
        const colGeo = new THREE.CylinderGeometry(0.4, 0.5, height - 2, 8);
        const col = new THREE.Mesh(colGeo, wallMat);
        col.position.set(
            depth / 2 + 0.3,
            height / 2 - 1,
            -width / 2 + 3 + i * (width / columnCount)
        );
        building.add(col);
    }

    // Pediment (triangular top) - classical Greek style
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-width / 2, 0);
    pedimentShape.lineTo(0, 4);
    pedimentShape.lineTo(width / 2, 0);
    pedimentShape.closePath();

    const pedimentGeo = new THREE.ExtrudeGeometry(pedimentShape, {
        depth: 1,
        bevelEnabled: false
    });
    const pediment = new THREE.Mesh(pedimentGeo, wallMat);
    pediment.rotation.y = Math.PI / 2;
    pediment.position.set(depth / 2 + 0.5, height, 0);
    building.add(pediment);

    // Roof
    const roofGeo = new THREE.BoxGeometry(depth + 1, 0.5, width + 1);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = height + 0.25;
    building.add(roof);

    // Windows
    const windowRows = Math.floor(height / 5);
    const windowCols = Math.floor(width / 5);
    for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
            const winGeo = new THREE.PlaneGeometry(1.5, 2.5);
            const win = new THREE.Mesh(winGeo, windowMat);
            win.position.set(
                depth / 2 + 0.15,
                3 + row * 5,
                -width / 2 + 4 + col * (width / windowCols)
            );
            building.add(win);
        }
    }

    // Base/foundation
    const baseGeo = new THREE.BoxGeometry(depth + 2, 1.5, width + 2);
    const baseMat = wallMat.clone();
    baseMat.color.set(0xB0A898);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.75;
    building.add(base);

    return building;
}

function createSimpleBuilding(width, height, depth, wallMat, roofMat) {
    const building = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(depth, height, width);
    const body = new THREE.Mesh(bodyGeo, wallMat);
    body.position.y = height / 2;
    building.add(body);

    const roofGeo = new THREE.BoxGeometry(depth + 0.5, 0.5, width + 0.5);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = height + 0.25;
    building.add(roof);

    return building;
}

function createPortaMacedonia() {
    const group = new THREE.Group();

    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xE0D8C8,
        roughness: 0.5,
        metalness: 0.1
    });

    // Two pillars
    const pillarGeo = new THREE.BoxGeometry(5, 22, 5);
    const leftPillar = new THREE.Mesh(pillarGeo, stoneMat);
    leftPillar.position.set(SQUARE_X - 35, 13, SQUARE_Z - 6);
    group.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, stoneMat);
    rightPillar.position.set(SQUARE_X - 35, 13, SQUARE_Z + 6);
    group.add(rightPillar);

    // Top span
    const spanGeo = new THREE.BoxGeometry(5, 4, 17);
    const span = new THREE.Mesh(spanGeo, stoneMat);
    span.position.set(SQUARE_X - 35, 22, SQUARE_Z);
    group.add(span);

    // Arch opening
    const archGeo = new THREE.TorusGeometry(5, 0.5, 8, 16, Math.PI);
    const arch = new THREE.Mesh(archGeo, stoneMat);
    arch.rotation.y = Math.PI / 2;
    arch.rotation.z = Math.PI;
    arch.position.set(SQUARE_X - 35, 8, SQUARE_Z);
    group.add(arch);

    // Decorative top
    const topGeo = new THREE.BoxGeometry(6, 2, 18);
    const top = new THREE.Mesh(topGeo, stoneMat);
    top.position.set(SQUARE_X - 35, 25, SQUARE_Z);
    group.add(top);

    return group;
}

function createStreetFurniture() {
    const group = new THREE.Group();

    const benchMat = new THREE.MeshStandardMaterial({
        color: 0x5A4A3A,
        roughness: 0.8,
        metalness: 0.1
    });

    const lampMat = new THREE.MeshStandardMaterial({
        color: 0x2A2A2A,
        roughness: 0.5,
        metalness: 0.5
    });

    // Benches around the square
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const benchGeo = new THREE.BoxGeometry(2.5, 0.6, 0.8);
        const bench = new THREE.Mesh(benchGeo, benchMat);
        bench.position.set(
            SQUARE_X + Math.cos(angle) * 25,
            2.7,
            SQUARE_Z + Math.sin(angle) * 25
        );
        bench.rotation.y = angle;
        group.add(bench);

        // Bench legs
        for (let leg = -1; leg <= 1; leg += 2) {
            const legGeo = new THREE.BoxGeometry(0.15, 0.5, 0.6);
            const legMesh = new THREE.Mesh(legGeo, lampMat);
            legMesh.position.set(
                SQUARE_X + Math.cos(angle) * 25 + Math.cos(angle + Math.PI / 2) * leg * 0.9,
                2.35,
                SQUARE_Z + Math.sin(angle) * 25 + Math.sin(angle + Math.PI / 2) * leg * 0.9
            );
            group.add(legMesh);
        }
    }

    // Street lamps around plaza
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 30;

        const postGeo = new THREE.CylinderGeometry(0.1, 0.15, 5, 6);
        const post = new THREE.Mesh(postGeo, lampMat);
        post.position.set(
            SQUARE_X + Math.cos(angle) * r,
            4.5 + 2,
            SQUARE_Z + Math.sin(angle) * r
        );
        group.add(post);

        const lampGeo = new THREE.SphereGeometry(0.4, 8, 6);
        const lampLightMat = new THREE.MeshStandardMaterial({
            color: 0xFFEECC,
            emissive: 0xFFDD88,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const lamp = new THREE.Mesh(lampGeo, lampLightMat);
        lamp.position.set(
            SQUARE_X + Math.cos(angle) * r,
            9.7,
            SQUARE_Z + Math.sin(angle) * r
        );
        group.add(lamp);
    }

    return group;
}

function createSquareTrees() {
    const group = new THREE.Group();

    const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x4A3018,
        roughness: 0.9
    });
    const leafColors = [0x2A5518, 0x336622, 0x2E5E1C];

    // Trees lining the square
    const treePositions = [
        { x: SQUARE_X - 35, z: SQUARE_Z - 30 },
        { x: SQUARE_X - 35, z: SQUARE_Z + 30 },
        { x: SQUARE_X + 10, z: SQUARE_Z - 40 },
        { x: SQUARE_X + 10, z: SQUARE_Z + 40 },
        { x: SQUARE_X - 45, z: SQUARE_Z - 15 },
        { x: SQUARE_X - 45, z: SQUARE_Z + 15 },
        { x: SQUARE_X - 50, z: SQUARE_Z - 40 },
        { x: SQUARE_X - 50, z: SQUARE_Z + 40 },
    ];

    treePositions.forEach((pos) => {
        const tree = new THREE.Group();

        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 3 + 2;
        tree.add(trunk);

        for (let j = 0; j < 5; j++) {
            const leafGeo = new THREE.SphereGeometry(2 + Math.random() * 1.5, 7, 6);
            const leafMat = new THREE.MeshStandardMaterial({
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                roughness: 0.85,
                flatShading: true
            });
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.set(
                (Math.random() - 0.5) * 3,
                7 + Math.random() * 3 + 2,
                (Math.random() - 0.5) * 3
            );
            tree.add(leaf);
        }

        tree.position.set(pos.x, 0, pos.z);
        group.add(tree);
    });

    return group;
}