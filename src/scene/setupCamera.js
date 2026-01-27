/**
 * Camera - positioned to see the bridge, square, and bazaar
 */
import * as THREE from 'three';

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Classic view: slightly elevated, looking at the bridge from downstream
    camera.position.set(-30, 25, 80);
    camera.lookAt(0, 8, 0);

    return camera;
}