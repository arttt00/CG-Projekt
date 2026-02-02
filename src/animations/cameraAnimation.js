/**
 * Camera animation - views of the Skopje Stone Bridge scene
 */
import * as THREE from 'three';

const CAMERA_VIEWS = {
    1: { // Classic postcard view (downstream, sees whole bridge)
        position: new THREE.Vector3(-30, 20, 80),
        target: new THREE.Vector3(0, 8, 0)
    },
    2: { // From Macedonia Square looking at bridge
        position: new THREE.Vector3(-60, 15, 5),
        target: new THREE.Vector3(0, 10, 0)
    },
    3: { // From Old Bazaar side
        position: new THREE.Vector3(70, 12, -10),
        target: new THREE.Vector3(0, 10, 0)
    },
    4: { // Aerial/top view
        position: new THREE.Vector3(0, 80, 60),
        target: new THREE.Vector3(0, 5, 0)
    },
    5: { // Walking on the bridge
        position: new THREE.Vector3(-40, 15, 2),
        target: new THREE.Vector3(40, 12, 0)
    },
    6: { // Monument close-up
        position: new THREE.Vector3(-70, 20, 20),
        target: new THREE.Vector3(-80, 15, 0)
    }
};

export function setupCameraAnimation(camera, controls) {
    return {
        transitioning: false,
        startPosition: new THREE.Vector3(),
        endPosition: new THREE.Vector3(),
        startTarget: new THREE.Vector3(),
        endTarget: new THREE.Vector3(),
        progress: 0,
        duration: 2.0
    };
}

export function transitionToView(viewIndex, camera, controls, cameraState) {
    const view = CAMERA_VIEWS[viewIndex];
    if (!view) return;

    cameraState.startPosition.copy(camera.position);
    cameraState.endPosition.copy(view.position);
    cameraState.startTarget.copy(controls.target);
    cameraState.endTarget.copy(view.target);
    cameraState.progress = 0;
    cameraState.transitioning = true;
}

export function animateCamera(camera, controls, cameraState, delta) {
    if (!cameraState.transitioning) return;

    cameraState.progress += delta / cameraState.duration;

    if (cameraState.progress >= 1) {
        cameraState.progress = 1;
        cameraState.transitioning = false;
    }

    const t = easeInOutCubic(cameraState.progress);

    camera.position.lerpVectors(cameraState.startPosition, cameraState.endPosition, t);
    controls.target.lerpVectors(cameraState.startTarget, cameraState.endTarget, t);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}