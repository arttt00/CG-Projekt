/**
 * River animation — Gerstner waves + shader time update
 * 8 wave layers for realistic blue river current
 */

// Wave definitions: direction, steepness, wavelength, speed
const WAVES = [
    // Primary downstream current (dominant)
    { dx: 0.0,   dy: 1.0,  steep: 0.028, wl: 60,  spd: 0.65 },
    { dx: 0.05,  dy: 1.0,  steep: 0.020, wl: 38,  spd: 0.50 },
    { dx: -0.08, dy: 1.0,  steep: 0.014, wl: 24,  spd: 0.80 },
    // Cross-river wind chop
    { dx: 1.0,   dy: 0.25, steep: 0.009, wl: 14,  spd: 1.20 },
    { dx: -0.8,  dy: 0.4,  steep: 0.006, wl: 9,   spd: 1.50 },
    // Fine surface ripples
    { dx: 0.5,   dy: 0.85, steep: 0.004, wl: 5,   spd: 2.00 },
    { dx: -0.3,  dy: 1.0,  steep: 0.003, wl: 3.0, spd: 2.50 },
    { dx: 0.7,   dy: -0.2, steep: 0.002, wl: 2.0, spd: 3.00 },
];

// Pre-compute wave parameters
const W = WAVES.map(w => {
    const len = Math.hypot(w.dx, w.dy);
    const k = (2 * Math.PI) / w.wl;
    return {
        dx: w.dx / len,
        dy: w.dy / len,
        k,
        spd: w.spd,
        amp: w.steep / k
    };
});

/**
 * Calculate summed wave height at a point
 */
function waveHeight(x, y, t) {
    let z = 0;
    for (let i = 0; i < W.length; i++) {
        const w = W[i];
        z += w.amp * Math.sin(w.k * (w.dx * x + w.dy * y) - w.spd * t);
    }
    return z;
}

/**
 * Smooth interpolation helper
 */
function smoothstep(a, b, x) {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

/**
 * Animate the water surface mesh and update shader uniforms
 * @param {THREE.Group|THREE.Mesh} input - Water group or mesh
 * @param {number} elapsed - Elapsed time in seconds
 */
export function animateWater(input, elapsed) {
    if (!input) return;

    // Find the water surface mesh
    let mesh = null;
    if (input.isGroup) {
        input.traverse(c => { if (c.name === 'WaterSurface') mesh = c; });
    } else if (input.isMesh) {
        mesh = input;
    }
    if (!mesh || !mesh.geometry) return;

    // Update shader time uniform
    if (mesh.material.uniforms && mesh.material.uniforms.uTime) {
        mesh.material.uniforms.uTime.value = elapsed;
    }

    const pos = mesh.geometry.attributes.position;

    // Cache original positions on first frame
    if (!mesh.geometry.userData.origPos) {
        mesh.geometry.userData.origPos = new Float32Array(pos.array);
        return;
    }

    const orig = mesh.geometry.userData.origPos;
    const t = elapsed * 0.85;
    const HW = 40; // half width of river

    for (let i = 0; i < pos.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];

        // Base Gerstner wave displacement
        let z = waveHeight(ox, oy, t);

        // Bank damping — waves fade smoothly near river edges
        const bankDist = Math.min(Math.abs(ox + HW), Math.abs(ox - HW));
        const bankFade = smoothstep(0, 14, bankDist);
        z *= bankFade;

        // Bridge pier interaction — standing waves and turbulence
        const bridgeDist = Math.abs(oy);
        if (bridgeDist < 25) {
            const pierXs = [-24, -8, 8, 24];
            for (let p = 0; p < pierXs.length; p++) {
                const pd = Math.abs(ox - pierXs[p]);
                if (pd < 8) {
                    const intensity = (1 - pd / 8) * smoothstep(25, 0, bridgeDist);

                    if (oy < 0) {
                        // Upstream: water piles up against pier
                        z += intensity * 0.18 * Math.sin(oy * 1.5 + t * 2.8);
                        z += intensity * 0.07 * Math.cos(oy * 3.0 + t * 4.2);
                    } else {
                        // Downstream: V-wake turbulence
                        z += intensity * 0.12 * Math.sin(ox * 2.5 + t * 4.5);
                        z += intensity * 0.08 * Math.cos(oy * 1.8 - t * 3.5);
                        z += intensity * 0.05 * Math.sin((ox * 1.5 + oy * 2.0) + t * 5.5);

                        // Wake spreading outward
                        const wakeSpread = oy * 0.12;
                        const wakeDist = Math.abs(ox - pierXs[p]);
                        if (wakeDist < wakeSpread + 3 && wakeDist > 1) {
                            z += 0.03 * Math.sin(oy * 0.8 - t * 2.2) * intensity;
                        }
                    }
                }
            }
        }

        // Deep slow swell
        z += Math.sin(oy * 0.01 + t * 0.18) * 0.10 * bankFade;
        z += Math.cos(ox * 0.02 + oy * 0.005 + t * 0.14) * 0.04 * bankFade;

        // Center channel is slightly lower (deeper river center)
        const centerDip = smoothstep(0, 20, bankDist) * -0.06;
        z += centerDip;

        pos.setZ(i, z);
    }

    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
}