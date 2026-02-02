/**
 * User interaction handler
 */
import * as THREE from 'three';
import { transitionToView } from './cameraAnimation.js';
import { setupFog } from '../scene/setupScene.js';

export function setupInteractions(state, camera, controls, scene, dirLight, ambientLight, cameraState) {

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case '1': case '2': case '3':
            case '4': case '5': case '6':
                transitionToView(parseInt(e.key), camera, controls, cameraState);
                break;
            case 't': case 'T':
                toggleTimeOfDay(state, scene, dirLight, ambientLight);
                break;
            case 'w': case 'W':
                state.waterFlowing = !state.waterFlowing;
                break;
            case 'f': case 'F':
                state.fogEnabled = !state.fogEnabled;
                setupFog(scene, state);
                break;
        }
    });

    window.addEventListener('viewChange', (e) => {
        transitionToView(e.detail, camera, controls, cameraState);
    });

    window.addEventListener('toggleTime', () => {
        toggleTimeOfDay(state, scene, dirLight, ambientLight);
    });

    window.addEventListener('toggleWater', () => {
        state.waterFlowing = !state.waterFlowing;
    });
}

function toggleTimeOfDay(state, scene, dirLight, ambientLight) {
    const times = ['day', 'sunset', 'night'];
    const currentIndex = times.indexOf(state.timeOfDay);
    state.timeOfDay = times[(currentIndex + 1) % times.length];

    const sky = scene.getObjectByName('sky');

    switch (state.timeOfDay) {
        case 'day':
            dirLight.color.set(0xFFF8E7);
            dirLight.intensity = 2.0;
            dirLight.position.set(40, 60, 30);
            ambientLight.color.set(0xC8D8E8);
            ambientLight.intensity = 0.4;
            if (sky && sky.material.uniforms) {
                sky.material.uniforms.topColor.value.set(0x4A8BD9);
                sky.material.uniforms.bottomColor.value.set(0xC8DCF0);
            }
            if (scene.fog) scene.fog.color.set(0xC8DCF0);
            break;

        case 'sunset':
            dirLight.color.set(0xFF7B3A);
            dirLight.intensity = 1.4;
            dirLight.position.set(5, 15, 50);
            ambientLight.color.set(0xCC7744);
            ambientLight.intensity = 0.3;
            if (sky && sky.material.uniforms) {
                sky.material.uniforms.topColor.value.set(0x1A1A4A);
                sky.material.uniforms.bottomColor.value.set(0xFF6633);
            }
            if (scene.fog) scene.fog.color.set(0xCC7744);
            break;

        case 'night':
            dirLight.color.set(0x3355AA);
            dirLight.intensity = 0.3;
            dirLight.position.set(-30, 50, 20);
            ambientLight.color.set(0x1A2244);
            ambientLight.intensity = 0.15;
            if (sky && sky.material.uniforms) {
                sky.material.uniforms.topColor.value.set(0x080820);
                sky.material.uniforms.bottomColor.value.set(0x151530);
            }
            if (scene.fog) scene.fog.color.set(0x0A0A22);
            break;
    }
}