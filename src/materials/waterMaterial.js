/**
 * Beautiful blue river water material
 */
import * as THREE from 'three';

function generateWaterNormalMap(size, octaves) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    const seeds = octaves.map(() => ({
        ox: Math.random() * 1000,
        oy: Math.random() * 1000,
    }));

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let nx = 0, ny = 0;
            octaves.forEach((oct, idx) => {
                const sx = (x + seeds[idx].ox) * oct.frequency / size;
                const sy = (y + seeds[idx].oy) * oct.frequency / size;
                nx += (
                    Math.sin(sx * 6.28 + sy * 3.14) * 0.5 +
                    Math.sin(sx * 3.14 * 1.7 - sy * 6.28 * 0.8) * 0.3 +
                    Math.cos(sx * 6.28 * 2.3 + sy * 6.28 * 1.1) * 0.2
                ) * oct.amplitude;
                ny += (
                    Math.cos(sy * 6.28 + sx * 3.14 * 0.9) * 0.5 +
                    Math.cos(sy * 3.14 * 1.4 - sx * 6.28 * 1.2) * 0.3 +
                    Math.sin(sy * 6.28 * 1.8 + sx * 6.28 * 0.7) * 0.2
                ) * oct.amplitude;
            });
            const idx = (y * size + x) * 4;
            data[idx] = Math.floor(Math.max(0, Math.min(255, 128 + nx * 127)));
            data[idx + 1] = Math.floor(Math.max(0, Math.min(255, 128 + ny * 127)));
            data[idx + 2] = 255;
            data[idx + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
}

export function createWaterMaterial() {
    const normalMap1 = generateWaterNormalMap(1024, [
        { frequency: 4, amplitude: 0.6 },
        { frequency: 8, amplitude: 0.3 },
        { frequency: 16, amplitude: 0.1 },
    ]);
    normalMap1.repeat.set(4, 8);

    const normalMap2 = generateWaterNormalMap(512, [
        { frequency: 12, amplitude: 0.5 },
        { frequency: 24, amplitude: 0.3 },
        { frequency: 48, amplitude: 0.2 },
    ]);
    normalMap2.repeat.set(10, 20);

    const material = new THREE.MeshPhysicalMaterial({
        // Deep blue river water
        color: new THREE.Color(0x0B3D6B),

        transparent: true,
        opacity: 0.92,

        roughness: 0.04,
        metalness: 0.0,

        // Light passes through water
        transmission: 0.12,
        thickness: 5.0,
        ior: 1.333,

        // Deep blue attenuation (what color light becomes as it passes through)
        attenuationColor: new THREE.Color(0x031225),
        attenuationDistance: 3.0,

        // Wave normals
        normalMap: normalMap1,
        normalScale: new THREE.Vector2(0.3, 0.3),

        // Glassy top layer
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        clearcoatNormalMap: normalMap2,
        clearcoatNormalScale: new THREE.Vector2(0.1, 0.1),

        // Sky reflections
        envMapIntensity: 2.0,
        reflectivity: 1.0,

        // Sun glints - bright white-blue
        specularIntensity: 1.5,
        specularColor: new THREE.Color(0xCCDDFF),

        // Wet sheen
        sheen: 0.15,
        sheenRoughness: 0.15,
        sheenColor: new THREE.Color(0x3366AA),

        side: THREE.FrontSide,
        depthWrite: false,
    });

    material.userData = { normalMap1, normalMap2 };
    return material;
}

export function createWaterUnderlay() {
    return new THREE.MeshStandardMaterial({
        // Very dark blue-black riverbed
        color: new THREE.Color(0x020810),
        roughness: 1.0,
        metalness: 0.0,
        side: THREE.FrontSide,
    });
}