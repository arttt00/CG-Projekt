/**
 * Scene setup - urban Skopje setting
 */
import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x4A8BD9) },
            bottomColor: { value: new THREE.Color(0xC8DCF0) },
            offset: { value: 20 },
            exponent: { value: 0.4 }
        },
        vertexShader: `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `,
        side: THREE.BackSide,
        depthWrite: false
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.name = 'sky';
    scene.add(sky);

    return scene;
}

export function setupFog(scene, state) {
    if (state.fogEnabled) {
        scene.fog = new THREE.FogExp2(0xC8DCF0, 0.002);
    } else {
        scene.fog = null;
    }
}