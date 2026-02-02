/**
 * Ambient lighting - urban setting, Mediterranean climate
 */
import * as THREE from 'three';

export function setupAmbientLight(scene) {
    const ambientLight = new THREE.AmbientLight(0xC8D8E8, 0.4);
    ambientLight.name = 'AmbientLight';
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(
        0x87CEEB,  // Sky
        0x8A8070,  // Ground (urban, not dark)
        0.4
    );
    hemiLight.name = 'HemisphereLight';
    scene.add(hemiLight);

    return ambientLight;
}