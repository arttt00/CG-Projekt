/**
 * Grass/ground material - lush green matching gorge vegetation
 */
import * as THREE from 'three';

/**
 * Creates a lush grass material
 * @returns {THREE.MeshStandardMaterial}
 */
export function createGrassMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Base rich green
    ctx.fillStyle = '#2A5518';
    ctx.fillRect(0, 0, 256, 256);

    // Grass blade detail
    for (let i = 0; i < 6000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const green = 50 + Math.random() * 70;
        ctx.fillStyle = `rgb(${15 + Math.random() * 25}, ${green}, ${8 + Math.random() * 15})`;
        ctx.fillRect(x, y, 1, 1 + Math.random() * 3);
    }

    // Darker patches (shadows/soil)
    for (let i = 0; i < 25; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctx.fillStyle = `rgba(30, 40, 15, ${0.15 + Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, 4 + Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.95,
        metalness: 0.0,
        color: 0x3A6828,
        side: THREE.DoubleSide
    });
}