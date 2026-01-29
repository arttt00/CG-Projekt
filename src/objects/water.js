
import * as THREE from 'three';
import { createWaterMaterial, createWaterUnderlay } from '../materials/waterMaterial.js';

export function createWater() {
    const waterGroup = new THREE.Group();
    waterGroup.name = 'Water';

    // Layer 1: Riverbed (textured floor visible through water)
    const bedGeo = new THREE.PlaneGeometry(84, 304, 4, 4);
    const bedMat = createWaterUnderlay();
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.rotation.x = -Math.PI / 2;
    bed.position.y = -3.0;
    bed.receiveShadow = true;
    waterGroup.add(bed);

    // Layer 2: Deep water tint (dark blue volume underneath)
    const deepGeo = new THREE.PlaneGeometry(83, 303, 4, 4);
    const deepMat = new THREE.MeshBasicMaterial({
        color: 0x031828,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const deepLayer = new THREE.Mesh(deepGeo, deepMat);
    deepLayer.rotation.x = -Math.PI / 2;
    deepLayer.position.y = -2.0;
    waterGroup.add(deepLayer);

    // Layer 3: Mid-depth blue haze
    const midGeo = new THREE.PlaneGeometry(82, 302, 4, 4);
    const midMat = new THREE.MeshBasicMaterial({
        color: 0x0C3058,
        transparent: true,
        opacity: 0.30,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const midLayer = new THREE.Mesh(midGeo, midMat);
    midLayer.rotation.x = -Math.PI / 2;
    midLayer.position.y = -1.2;
    waterGroup.add(midLayer);

    // Layer 4: Main water surface (high-res for wave animation + shader)
    const waterGeo = new THREE.PlaneGeometry(80, 300, 200, 200);
    const waterMat = createWaterMaterial();
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.3;
    water.name = 'WaterSurface';
    water.receiveShadow = true;
    waterGroup.add(water);

    return waterGroup;
}