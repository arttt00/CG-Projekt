/**
 * Point lights - urban accent lighting
 */
import * as THREE from 'three';

export function setupPointLights(scene) {
    const pointLights = [];

    // Warm light on bridge from lampposts
    const bridgeLight1 = new THREE.PointLight(0xFFDDB0, 0.3, 30);
    bridgeLight1.position.set(-20, 18, 0);
    scene.add(bridgeLight1);
    pointLights.push(bridgeLight1);

    const bridgeLight2 = new THREE.PointLight(0xFFDDB0, 0.3, 30);
    bridgeLight2.position.set(20, 18, 0);
    scene.add(bridgeLight2);
    pointLights.push(bridgeLight2);

    // Monument light
    const monumentLight = new THREE.PointLight(0xFFEECC, 0.4, 40);
    monumentLight.position.set(-80, 35, 0);
    scene.add(monumentLight);
    pointLights.push(monumentLight);

    // Mosque area light
    const mosqueLight = new THREE.PointLight(0xFFEEAA, 0.2, 30);
    mosqueLight.position.set(130, 20, -40);
    scene.add(mosqueLight);
    pointLights.push(mosqueLight);

    // Water reflection light
    const waterLight = new THREE.PointLight(0x4A8B7A, 0.2, 40);
    waterLight.position.set(0, 2, 0);
    scene.add(waterLight);
    pointLights.push(waterLight);

    return pointLights;
}