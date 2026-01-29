
import * as THREE from 'three';
import { createGrassMaterial } from '../materials/grassMaterial.js';

const RIVER_WIDTH = 80;
const BANK_HEIGHT = 2;

export function createTerrain() {
    const terrainGroup = new THREE.Group();
    terrainGroup.name = 'Terrain';

    // ---- SOUTH BANK (Macedonia Square side) ----
    const southBank = createUrbanGround('south');
    terrainGroup.add(southBank);

    // ---- NORTH BANK (Old Bazaar side) ----
    const northBank = createUrbanGround('north');
    terrainGroup.add(northBank);

    // ---- RIVER EMBANKMENT WALLS ----
    const embankments = createEmbankments();
    terrainGroup.add(embankments);

    // ---- RIVERBED ----
    const riverBed = createRiverBed();
    terrainGroup.add(riverBed);

    // ---- DISTANT TERRAIN (background) ----
    const background = createBackgroundTerrain();
    terrainGroup.add(background);

    terrainGroup.traverse((child) => {
        if (child.isMesh) {
            child.receiveShadow = true;
        }
    });

    return terrainGroup;
}

function createUrbanGround(side) {
    const group = new THREE.Group();
    const xOffset = side === 'south' ? -RIVER_WIDTH / 2 - 60 : RIVER_WIDTH / 2 + 60;

    // Main ground plane
    const groundGeo = new THREE.PlaneGeometry(120, 300, 10, 10);
    const groundMat = new THREE.MeshStandardMaterial({
        color: side === 'south' ? 0x9A9080 : 0x8A8070,
        roughness: 0.95,
        metalness: 0.02
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(xOffset, BANK_HEIGHT, 0);
    group.add(ground);

    // Grass areas
    const grassMat = createGrassMaterial();
    for (let i = 0; i < 5; i++) {
        const patchGeo = new THREE.PlaneGeometry(
            10 + Math.random() * 20,
            10 + Math.random() * 20
        );
        const patch = new THREE.Mesh(patchGeo, grassMat);
        patch.rotation.x = -Math.PI / 2;
        patch.position.set(
            xOffset + (Math.random() - 0.5) * 80,
            BANK_HEIGHT + 0.05,
            (Math.random() - 0.5) * 200
        );
        group.add(patch);
    }

    return group;
}

function createEmbankments() {
    const group = new THREE.Group();

    const wallMat = new THREE.MeshStandardMaterial({
        color: 0x6A6050,
        roughness: 0.9,
        metalness: 0.05
    });

    // South embankment wall (along the river)
    const southWallGeo = new THREE.BoxGeometry(3, BANK_HEIGHT + 4, 300);
    const southWall = new THREE.Mesh(southWallGeo, wallMat);
    southWall.position.set(-RIVER_WIDTH / 2, 0, 0);
    group.add(southWall);

    // North embankment wall
    const northWallGeo = new THREE.BoxGeometry(3, BANK_HEIGHT + 4, 300);
    const northWall = new THREE.Mesh(northWallGeo, wallMat);
    northWall.position.set(RIVER_WIDTH / 2, 0, 0);
    group.add(northWall);

    // Stone texture on embankment
    for (let z = -150; z < 150; z += 2) {
        for (let side = -1; side <= 1; side += 2) {
            const blockGeo = new THREE.BoxGeometry(0.3, 1 + Math.random() * 0.5, 1.5 + Math.random() * 0.5);
            const blockMat = wallMat.clone();
            const v = (Math.random() - 0.5) * 0.06;
            blockMat.color.r += v;
            blockMat.color.g += v;
            blockMat.color.b += v;

            const block = new THREE.Mesh(blockGeo, blockMat);
            block.position.set(
                side * (RIVER_WIDTH / 2) + side * 1.7,
                -1 + Math.random() * 4,
                z
            );
            group.add(block);
        }
    }

    return group;
}

function createRiverBed() {
    const geo = new THREE.PlaneGeometry(RIVER_WIDTH, 300, 20, 20);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x3A3828,
        roughness: 1.0,
        metalness: 0.0,
        flatShading: true
    });

    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        positions.setZ(i, (Math.random() - 0.5) * 0.5);
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4;
    mesh.name = 'RiverBed';
    return mesh;
}

function createBackgroundTerrain() {
    const group = new THREE.Group();

    // Distant ground
    const farGroundGeo = new THREE.PlaneGeometry(800, 800);
    const farGroundMat = new THREE.MeshStandardMaterial({
        color: 0x6A7A5A,
        roughness: 1.0
    });
    const farGround = new THREE.Mesh(farGroundGeo, farGroundMat);
    farGround.rotation.x = -Math.PI / 2;
    farGround.position.y = 1.5;
    group.add(farGround);

    // Distant mountains (Vodno mountain to the south)
    for (let i = 0; i < 6; i++) {
        const mountainGeo = new THREE.ConeGeometry(
            40 + Math.random() * 60,
            30 + Math.random() * 40,
            6
        );
        const mountainMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.3, 0.25, 0.25 + Math.random() * 0.1),
            roughness: 0.95,
            flatShading: true
        });
        const mountain = new THREE.Mesh(mountainGeo, mountainMat);
        const angle = (i / 6) * Math.PI + Math.PI * 0.8;
        mountain.position.set(
            Math.cos(angle) * (200 + Math.random() * 100),
            15,
            Math.sin(angle) * (200 + Math.random() * 100)
        );
        group.add(mountain);
    }

    return group;
}