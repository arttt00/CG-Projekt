
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createScene, setupFog } from './scene/setupScene.js';
import { createCamera } from './scene/setupCamera.js';
import { createRenderer } from './scene/setupRenderer.js';
import { createBridge } from './objects/bridge.js';
import { createTerrain } from './objects/terrain.js';
import { createWater } from './objects/water.js';
import { createTrees } from './objects/trees.js';
import { createRocks } from './objects/rocks.js';
import { createMacedoniaSquare } from './objects/square.js';
import { createOldBazaar } from './objects/bazar.js';
import { setupAmbientLight } from './lighting/ambientLight.js';
import { setupDirectionalLight } from './lighting/directionalLight.js';
import { setupPointLights } from './lighting/pointLights.js';
import { animateWater } from './animations/waterAnimation.js';
import { setupCameraAnimation, animateCamera } from './animations/cameraAnimation.js';
import { setupInteractions } from './animations/interactionHandler.js';

// ============================================================
// INITIALIZATION
// ============================================================

const clock = new THREE.Clock();
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 15;
controls.maxDistance = 250;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 8, 0);

// ============================================================
// BUILD SCENE
// ============================================================

// Terrain (riverbanks, embankments, background)
const terrain = createTerrain();
scene.add(terrain);

// Vardar River
const water = createWater();
scene.add(water);

// The Stone Bridge (10 arches)
const bridgeGroup = createBridge();
scene.add(bridgeGroup);

// Rocks along riverbank
const rocksGroup = createRocks();
scene.add(rocksGroup);

// Trees (urban, along embankments)
const treesGroup = createTrees();
scene.add(treesGroup);

// Macedonia Square (south bank)
const macedoniaSquare = createMacedoniaSquare();
scene.add(macedoniaSquare);

// Old Bazaar (north bank)
const oldBazaar = createOldBazaar();
scene.add(oldBazaar);

// ============================================================
// LIGHTING
// ============================================================

const ambientLight = setupAmbientLight(scene);
const { dirLight } = setupDirectionalLight(scene);
const pointLightsArray = setupPointLights(scene);

// ============================================================
// STATE & INTERACTIONS
// ============================================================

const state = {
    timeOfDay: 'day',
    waterFlowing: true,
    fogEnabled: true,
};

setupFog(scene, state);
const cameraState = setupCameraAnimation(camera, controls);
setupInteractions(state, camera, controls, scene, dirLight, ambientLight, cameraState);

// ============================================================
// ANIMATION LOOP
// ============================================================

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (state.waterFlowing) {
        animateWater(water, elapsed);
    }

    animateCamera(camera, controls, cameraState, delta);

    // Gentle tree sway
    treesGroup.children.forEach((tree, i) => {
        if (tree.userData.isTree) {
            tree.rotation.z = Math.sin(elapsed * 0.3 + i * 0.5) * 0.01;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}

// ============================================================
// RESIZE & START
// ============================================================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const loadingEl = document.getElementById('loading');
if (loadingEl) {
    loadingEl.style.opacity = '0';
    setTimeout(() => loadingEl.remove(), 500);
}

animate();
console.log('Ura E Gurit- Skopje scene initialized');
console.log('Controls: 1-6 Camera Views | T Time | W Water | F Fog');