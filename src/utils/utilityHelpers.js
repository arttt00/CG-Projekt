/**
 * Utility helpers
 */
import * as THREE from 'three';

export function addDebugHelpers(scene, visible = false) {
    const gridHelper = new THREE.GridHelper(100, 50, 0x444444, 0x222222);
    gridHelper.visible = visible;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(20);
    axesHelper.visible = visible;
    scene.add(axesHelper);

    return { gridHelper, axesHelper };
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function disposeObject(object) {
    object.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
    });
}