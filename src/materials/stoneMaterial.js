/**
 * Stone materials - weathered grey-brown stone matching Kamen Most
 * Aged, mossy, with visible mortar joints
 */
import * as THREE from 'three';

/**
 * Creates weathered stone material for arch voussoirs
 * @returns {THREE.MeshStandardMaterial}
 */
export function createStoneMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base grey-brown stone color
    ctx.fillStyle = '#7A7268';
    ctx.fillRect(0, 0, 512, 512);

    // Stone grain texture
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const base = 90 + Math.random() * 60;
        const r = base + 10;
        const g = base + 5;
        const b = base - 5;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }

    // Weathering stains (darker patches)
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 15 + Math.random() * 40;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(50, 40, 30, 0.25)');
        gradient.addColorStop(1, 'rgba(50, 40, 30, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    // Moss/lichen patches (green-ish stains)
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 10 + Math.random() * 25;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(60, 80, 40, 0.2)');
        gradient.addColorStop(1, 'rgba(60, 80, 40, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    // Fine cracks
    ctx.strokeStyle = 'rgba(40, 35, 25, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        let x = Math.random() * 512;
        let y = Math.random() * 512;
        ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) {
            x += (Math.random() - 0.5) * 40;
            y += (Math.random() - 0.5) * 40;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    // Normal map
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = 512;
    normalCanvas.height = 512;
    const nCtx = normalCanvas.getContext('2d');
    nCtx.fillStyle = '#8080FF';
    nCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 128 + (Math.random() - 0.5) * 30;
        const g = 128 + (Math.random() - 0.5) * 30;
        nCtx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, 255)`;
        nCtx.fillRect(x, y, 2 + Math.random() * 2, 2 + Math.random() * 2);
    }
    const normalTexture = new THREE.CanvasTexture(normalCanvas);
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
        map: texture,
        normalMap: normalTexture,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughness: 0.88,
        metalness: 0.04,
        color: 0x8A8078,
        side: THREE.DoubleSide
    });
}

/**
 * Creates stone wall material with mortar joints (for deck, abutments)
 * @returns {THREE.MeshStandardMaterial}
 */
export function createStoneWallMaterial() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base
    ctx.fillStyle = '#706860';
    ctx.fillRect(0, 0, 512, 512);

    // Stone block pattern with mortar joints
    const blockHeight = 40;
    const blockWidth = 80;

    for (let row = 0; row < Math.ceil(512 / blockHeight); row++) {
        const offset = (row % 2) * (blockWidth / 2);
        for (let col = -1; col < Math.ceil(512 / blockWidth) + 1; col++) {
            const x = col * blockWidth + offset;
            const y = row * blockHeight;

            // Individual stone color variation
            const base = 85 + Math.random() * 40;
            ctx.fillStyle = `rgb(${base + 15}, ${base + 8}, ${base})`;
            ctx.fillRect(x + 2, y + 2, blockWidth - 4, blockHeight - 4);

            // Stone texture within block
            for (let k = 0; k < 30; k++) {
                const px = x + 2 + Math.random() * (blockWidth - 4);
                const py = y + 2 + Math.random() * (blockHeight - 4);
                const b2 = 70 + Math.random() * 50;
                ctx.fillStyle = `rgb(${b2 + 10}, ${b2 + 5}, ${b2})`;
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // Horizontal mortar line
        ctx.fillStyle = 'rgba(50, 45, 35, 0.6)';
        ctx.fillRect(0, row * blockHeight, 512, 3);
    }

    // Vertical mortar lines
    for (let row = 0; row < Math.ceil(512 / blockHeight); row++) {
        const offset = (row % 2) * (blockWidth / 2);
        for (let col = 0; col < Math.ceil(512 / blockWidth) + 1; col++) {
            const x = col * blockWidth + offset;
            ctx.fillStyle = 'rgba(50, 45, 35, 0.5)';
            ctx.fillRect(x - 1, row * blockHeight, 3, blockHeight);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.92,
        metalness: 0.04,
        color: 0x7A7068
    });
}