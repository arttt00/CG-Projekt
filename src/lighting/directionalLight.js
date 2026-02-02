/**
 * Directional (sun) light for urban scene
 */
import * as THREE from 'three';

export function setupDirectionalLight(scene) {
    const dirLight = new THREE.DirectionalLight(0xFFF8E7, 2.0);
    dirLight.position.set(40, 60, 30);
    dirLight.target.position.set(0, 5, 0);
    dirLight.name = 'SunLight';

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 80;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    dirLight.shadow.radius = 2;

    scene.add(dirLight);
    scene.add(dirLight.target);

    return { dirLight };
}