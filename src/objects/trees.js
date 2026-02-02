
import * as THREE from 'three';
import { createWoodMaterial } from '../materials/woodMaterial.js';

export function createTrees() {
    const treesGroup = new THREE.Group();
    treesGroup.name = 'Trees';

    const trunkMat = createWoodMaterial();

    // Trees along south embankment (near Macedonia Square)
    for (let z = -60; z <= 60; z += 12) {
        const tree = createCityTree(trunkMat, 0.9 + Math.random() * 0.3);
        tree.position.set(-45, 2, z);
        tree.userData.isTree = true;
        treesGroup.add(tree);
    }

    // Trees along north embankment (near Old Bazaar)
    for (let z = -60; z <= 60; z += 12) {
        const tree = createCityTree(trunkMat, 0.8 + Math.random() * 0.3);
        tree.position.set(45, 2, z);
        tree.userData.isTree = true;
        treesGroup.add(tree);
    }

    // Scattered trees near buildings
    const scatteredPositions = [
        { x: -60, z: 30 }, { x: -70, z: -20 },
        { x: 65, z: 25 }, { x: 70, z: -30 },
        { x: -55, z: -45 }, { x: 75, z: 0 },
    ];

    scatteredPositions.forEach((pos) => {
        const tree = createCityTree(trunkMat, 0.7 + Math.random() * 0.5);
        tree.position.set(pos.x, 2, pos.z);
        tree.userData.isTree = true;
        treesGroup.add(tree);
    });

    treesGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return treesGroup;
}

function createCityTree(trunkMat, scale) {
    const tree = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.2 * scale, 0.35 * scale, 5 * scale, 6);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2.5 * scale;
    tree.add(trunk);

    const leafColors = [0x2A5518, 0x336622, 0x2E5E1C, 0x3A7028];
    for (let i = 0; i < 5; i++) {
        const leafGeo = new THREE.SphereGeometry(
            (1.5 + Math.random() * 1.0) * scale, 7, 6
        );
        const leafMat = new THREE.MeshStandardMaterial({
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            roughness: 0.85,
            flatShading: true
        });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(
            (Math.random() - 0.5) * 2 * scale,
            (5 + Math.random() * 2) * scale,
            (Math.random() - 0.5) * 2 * scale
        );
        tree.add(leaf);
    }

    return tree;
}