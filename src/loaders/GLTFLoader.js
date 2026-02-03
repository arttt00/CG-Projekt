/**
 * Model loader utility for importing external 3D models
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadModel(path, scene, options = {}) {
    const {
        position = { x: 0, y: 0, z: 0 },
        scale = { x: 1, y: 1, z: 1 },
        rotation = { x: 0, y: 0, z: 0 },
        castShadow = true,
        receiveShadow = true
    } = options;

    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.position.set(position.x, position.y, position.z);
                model.scale.set(scale.x, scale.y, scale.z);
                model.rotation.set(rotation.x, rotation.y, rotation.z);
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = castShadow;
                        child.receiveShadow = receiveShadow;
                    }
                });
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error(`Error loading model ${path}:`, error);
                reject(error);
            }
        );
    });
}