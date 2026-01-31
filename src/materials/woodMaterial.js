/**
 * Wood material for tree trunks
 */
import * as THREE from 'three';

/**
 * Creates a bark material for tree trunks
 * @returns {THREE.MeshStandardMaterial}
 */
export function createWoodMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Dark bark base
    ctx.fillStyle = '#3A2818';
    ctx.fillRect(0, 0, 128, 256);

    // Vertical bark ridges
    for (let i = 0; i < 35; i++) {
        const x = Math.random() * 128;
        const brightness = 35 + Math.random() * 35;
        ctx.strokeStyle = `rgb(${brightness + 15}, ${brightness}, ${brightness - 10})`;
        ctx.lineWidth = 1 + Math.random() * 4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y < 256; y += 8) {
            ctx.lineTo(x + (Math.random() - 0.5) * 6, y);
        }
        ctx.stroke();
    }

    // Knots
    for (let i = 0; i < 2; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 256;
        ctx.fillStyle = 'rgba(25, 15, 8, 0.7)';
        ctx.beginPath();
        ctx.ellipse(x, y, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.92,
        metalness: 0.0,
        color: 0x4A3018
    });
}