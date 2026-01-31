
import * as THREE from 'three';
import { createStoneMaterial, createStoneWallMaterial } from '../materials/stoneMaterial.js';

// Bridge dimensions (scaled: 1 unit ≈ 1 meter)
const BRIDGE_WIDTH = 6;
const TOTAL_LENGTH = 180;
const LARGE_ARCH_SPAN = 16;
const LARGE_ARCH_HEIGHT = 9;
const SMALL_ARCH_SPAN = 8;
const SMALL_ARCH_HEIGHT = 5;
const PIER_WIDTH = 3.5;
const DECK_Y = 12;
const PARAPET_HEIGHT = 1.2;

// Ramp settings
const RAMP_LENGTH = 25;        // length of each angled ramp
const RAMP_DROP = 8;            // how far down the ramp descends
const FLAT_LENGTH = TOTAL_LENGTH - RAMP_LENGTH * 2; // flat section in the middle

export function createBridge() {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = 'StoneBridge';

    const stoneMat = createStoneMaterial();
    const wallMat = createStoneWallMaterial();

    const archLayout = calculateArchLayout();

    // ---- PIERS ----
    const piersGroup = createPiers(archLayout, wallMat);
    piersGroup.name = 'Piers';
    bridgeGroup.add(piersGroup);

    // ---- ARCHES ----
    const archesGroup = createArches(archLayout, stoneMat);
    archesGroup.name = 'Arches';
    bridgeGroup.add(archesGroup);

    // ---- CUTWATERS ----
    const cutwaterGroup = createCutwaters(archLayout, stoneMat);
    cutwaterGroup.name = 'Cutwaters';
    bridgeGroup.add(cutwaterGroup);

    // ---- SPANDREL WALLS ----
    const spandrelGroup = createSpandrelWalls(archLayout, wallMat);
    spandrelGroup.name = 'SpandrelWalls';
    bridgeGroup.add(spandrelGroup);

    // ---- DECK WITH RAMPS ----
    const deckGroup = createDeck(archLayout, wallMat);
    deckGroup.name = 'Deck';
    bridgeGroup.add(deckGroup);

    // ---- PARAPETS (follow ramp angle) ----
    const parapetLeft = createParapet(archLayout, stoneMat, -1);
    parapetLeft.name = 'ParapetLeft';
    bridgeGroup.add(parapetLeft);

    const parapetRight = createParapet(archLayout, stoneMat, 1);
    parapetRight.name = 'ParapetRight';
    bridgeGroup.add(parapetRight);

    // ---- LAMPPOSTS ----
    const lampposts = createLampposts(archLayout);
    lampposts.name = 'Lampposts';
    bridgeGroup.add(lampposts);

    // Enable shadows
    bridgeGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    bridgeGroup.position.set(0, 0, 0);
    return bridgeGroup;
}

/**
 * Returns the Y height of the deck at a given X position,
 * accounting for ramp slopes at both ends.
 */
function getDeckYAtX(x) {
    const halfFlat = FLAT_LENGTH / 2;
    const rampAngle = Math.atan2(RAMP_DROP, RAMP_LENGTH);

    if (x < -halfFlat) {
        // South ramp — slopes down toward negative X
        const distIntoRamp = Math.min((-halfFlat - x), RAMP_LENGTH);
        return DECK_Y - (distIntoRamp / RAMP_LENGTH) * RAMP_DROP;
    } else if (x > halfFlat) {
        // North ramp — slopes down toward positive X
        const distIntoRamp = Math.min((x - halfFlat), RAMP_LENGTH);
        return DECK_Y - (distIntoRamp / RAMP_LENGTH) * RAMP_DROP;
    }
    // Flat section
    return DECK_Y;
}

/**
 * Calculate positions of all arches and piers
 */
function calculateArchLayout() {
    const layout = {
        arches: [],
        piers: []
    };

    let x = -TOTAL_LENGTH / 2;

    // South abutment
    layout.piers.push({ x: x, width: 4, type: 'abutment' });
    x += 4;

    // 3 small south arches
    for (let i = 0; i < 3; i++) {
        layout.arches.push({
            centerX: x + SMALL_ARCH_SPAN / 2,
            span: SMALL_ARCH_SPAN,
            height: SMALL_ARCH_HEIGHT,
            type: 'small'
        });
        x += SMALL_ARCH_SPAN;
        layout.piers.push({ x: x, width: PIER_WIDTH, type: 'land_pier' });
        x += PIER_WIDTH;
    }

    // 4 large river arches
    for (let i = 0; i < 4; i++) {
        layout.arches.push({
            centerX: x + LARGE_ARCH_SPAN / 2,
            span: LARGE_ARCH_SPAN,
            height: LARGE_ARCH_HEIGHT,
            type: 'large'
        });
        x += LARGE_ARCH_SPAN;
        if (i < 3) {
            layout.piers.push({ x: x, width: PIER_WIDTH, type: 'river_pier' });
            x += PIER_WIDTH;
        }
    }

    // Transition pier
    layout.piers.push({ x: x, width: PIER_WIDTH, type: 'land_pier' });
    x += PIER_WIDTH;

    // 3 small north arches
    for (let i = 0; i < 3; i++) {
        layout.arches.push({
            centerX: x + SMALL_ARCH_SPAN / 2,
            span: SMALL_ARCH_SPAN,
            height: SMALL_ARCH_HEIGHT,
            type: 'small'
        });
        x += SMALL_ARCH_SPAN;
        if (i < 2) {
            layout.piers.push({ x: x, width: PIER_WIDTH, type: 'land_pier' });
            x += PIER_WIDTH;
        }
    }

    // North abutment
    layout.piers.push({ x: x, width: 4, type: 'abutment' });

    return layout;
}

/**
 * Creates vertical piers
 */
function createPiers(layout, material) {
    const group = new THREE.Group();

    layout.piers.forEach((pier, idx) => {
        const pierHeight = DECK_Y + 3;
        const isAbutment = pier.type === 'abutment';
        const w = isAbutment ? pier.width + 2 : pier.width;
        const d = BRIDGE_WIDTH + 1;

        const geo = new THREE.BoxGeometry(w, pierHeight, d);
        const mat = material.clone();
        const v = (Math.random() - 0.5) * 0.04;
        mat.color.r += v;
        mat.color.g += v;
        mat.color.b += v;

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(pier.x + w / 2, pierHeight / 2 - 4, 0);
        mesh.name = `Pier_${idx}`;
        group.add(mesh);

        if (!isAbutment) {
            const baseGeo = new THREE.BoxGeometry(w + 1, 2, d + 1);
            const base = new THREE.Mesh(baseGeo, material);
            base.position.set(pier.x + w / 2, -3, 0);
            group.add(base);
        }
    });

    return group;
}

/**
 * Creates semicircular arches
 */
function createArches(layout, material) {
    const group = new THREE.Group();

    layout.arches.forEach((arch, idx) => {
        const archMesh = createSingleArch(
            arch.span,
            arch.height,
            BRIDGE_WIDTH + 0.5,
            material,
            arch.type
        );
        archMesh.position.set(arch.centerX, DECK_Y - arch.height, 0);
        archMesh.name = `Arch_${idx}_${arch.type}`;
        group.add(archMesh);
    });

    return group;
}

/**
 * Creates a single semicircular arch from voussoir blocks
 */
function createSingleArch(span, height, depth, material, type) {
    const archGroup = new THREE.Group();
    const radius = span / 2;
    const thickness = type === 'large' ? 1.8 : 1.2;
    const segments = type === 'large' ? 24 : 16;

    for (let i = 0; i < segments; i++) {
        const angle1 = (Math.PI / segments) * i;
        const angle2 = (Math.PI / segments) * (i + 1);

        const innerR = radius;
        const outerR = radius + thickness;

        const shape = new THREE.Shape();
        shape.moveTo(Math.cos(angle1) * innerR, Math.sin(angle1) * innerR);
        shape.lineTo(Math.cos(angle1) * outerR, Math.sin(angle1) * outerR);
        shape.lineTo(Math.cos(angle2) * outerR, Math.sin(angle2) * outerR);
        shape.lineTo(Math.cos(angle2) * innerR, Math.sin(angle2) * innerR);
        shape.closePath();

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 1
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const blockMat = material.clone();
        const colorVar = (Math.random() - 0.5) * 0.06;
        blockMat.color.r += colorVar;
        blockMat.color.g += colorVar - 0.01;
        blockMat.color.b += colorVar - 0.02;

        const block = new THREE.Mesh(geometry, blockMat);
        block.position.z = -depth / 2;
        archGroup.add(block);
    }

    // Keystone
    const keystoneGeo = new THREE.BoxGeometry(
        type === 'large' ? 1.5 : 1.0,
        thickness + 0.3,
        depth + 0.3
    );
    const keystoneMat = material.clone();
    keystoneMat.color.set(0x7A7268);
    const keystone = new THREE.Mesh(keystoneGeo, keystoneMat);
    keystone.position.set(0, radius + thickness / 2, 0);
    archGroup.add(keystone);

    return archGroup;
}

/**
 * Creates triangular cutwaters on river piers
 */
function createCutwaters(layout, material) {
    const group = new THREE.Group();

    layout.piers.forEach((pier) => {
        if (pier.type !== 'river_pier') return;

        const upstreamGeo = createCutwaterGeometry(pier.width, 8, 3);
        const upstream = new THREE.Mesh(upstreamGeo, material);
        upstream.position.set(pier.x + pier.width / 2, 1, -BRIDGE_WIDTH / 2 - 1.5);
        upstream.rotation.y = Math.PI;
        group.add(upstream);

        const downstreamGeo = createCutwaterGeometry(pier.width, 8, 2.5);
        const downstream = new THREE.Mesh(downstreamGeo, material);
        downstream.position.set(pier.x + pier.width / 2, 1, BRIDGE_WIDTH / 2 + 1.5);
        group.add(downstream);
    });

    return group;
}

function createCutwaterGeometry(baseWidth, height, pointLength) {
    const shape = new THREE.Shape();
    shape.moveTo(-baseWidth / 2, 0);
    shape.lineTo(baseWidth / 2, 0);
    shape.lineTo(0, pointLength);
    shape.closePath();

    const extrudeSettings = { depth: height, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -height / 2 + 4, 0);
    return geo;
}

/**
 * Creates stone fill between arch tops and deck level
 */
function createSpandrelWalls(layout, material) {
    const group = new THREE.Group();

    layout.arches.forEach((arch) => {
        const radius = arch.span / 2;
        const archTopY = DECK_Y - arch.height + radius + (arch.type === 'large' ? 1.8 : 1.2);
        const fillHeight = DECK_Y - archTopY;

        if (fillHeight > 0.5) {
            for (let side = -1; side <= 1; side += 2) {
                const fillGeo = new THREE.BoxGeometry(arch.span * 0.8, fillHeight, 0.8);
                const fill = new THREE.Mesh(fillGeo, material);
                fill.position.set(
                    arch.centerX,
                    archTopY + fillHeight / 2,
                    side * (BRIDGE_WIDTH / 2 + 0.2)
                );
                group.add(fill);
            }
        }
    });

    return group;
}

/**
 * Creates the road deck with angled ramps at both ends
 */
function createDeck(layout, material) {
    const deckGroup = new THREE.Group();

    // === FLAT CENTER DECK ===
    const flatGeo = new THREE.BoxGeometry(FLAT_LENGTH, 1.0, BRIDGE_WIDTH + 0.5);
    const flatDeck = new THREE.Mesh(flatGeo, material);
    flatDeck.position.set(0, DECK_Y, 0);
    flatDeck.name = 'DeckSlab';
    deckGroup.add(flatDeck);

    // === SOUTH RAMP (negative X — monument side) ===
    const rampAngle = Math.atan2(RAMP_DROP, RAMP_LENGTH);
    const rampHypotenuse = Math.sqrt(RAMP_LENGTH * RAMP_LENGTH + RAMP_DROP * RAMP_DROP);

    const southRampGeo = new THREE.BoxGeometry(rampHypotenuse, 1.0, BRIDGE_WIDTH + 0.5);
    const southRamp = new THREE.Mesh(southRampGeo, material);
    southRamp.position.set(
        -FLAT_LENGTH / 2 - RAMP_LENGTH / 2,
        DECK_Y - RAMP_DROP / 2,
        0
    );
    southRamp.rotation.z = rampAngle; // tilts south end downward
    deckGroup.add(southRamp);

    // South ramp underside fill (so there's no gap underneath)
    const southFillShape = new THREE.Shape();
    southFillShape.moveTo(0, 0);
    southFillShape.lineTo(RAMP_LENGTH, RAMP_DROP);
    southFillShape.lineTo(RAMP_LENGTH, 0);
    southFillShape.closePath();
    const southFillGeo = new THREE.ExtrudeGeometry(southFillShape, {
        depth: BRIDGE_WIDTH + 0.5,
        bevelEnabled: false
    });
    const southFill = new THREE.Mesh(southFillGeo, material);
    southFill.position.set(
        -FLAT_LENGTH / 2 - RAMP_LENGTH,
        DECK_Y - RAMP_DROP - 0.5,
        -(BRIDGE_WIDTH + 0.5) / 2
    );
    deckGroup.add(southFill);

    // === NORTH RAMP (positive X — bazaar side) ===
    const northRampGeo = new THREE.BoxGeometry(rampHypotenuse, 1.0, BRIDGE_WIDTH + 0.5);
    const northRamp = new THREE.Mesh(northRampGeo, material);
    northRamp.position.set(
        FLAT_LENGTH / 2 + RAMP_LENGTH / 2,
        DECK_Y - RAMP_DROP / 2,
        0
    );
    northRamp.rotation.z = -rampAngle; // tilts north end downward
    deckGroup.add(northRamp);

    // North ramp underside fill
    const northFillShape = new THREE.Shape();
    northFillShape.moveTo(0, 0);
    northFillShape.lineTo(0, RAMP_DROP);
    northFillShape.lineTo(RAMP_LENGTH, 0);
    northFillShape.closePath();
    const northFillGeo = new THREE.ExtrudeGeometry(northFillShape, {
        depth: BRIDGE_WIDTH + 0.5,
        bevelEnabled: false
    });
    const northFill = new THREE.Mesh(northFillGeo, material);
    northFill.position.set(
        FLAT_LENGTH / 2,
        DECK_Y - RAMP_DROP - 0.5,
        -(BRIDGE_WIDTH + 0.5) / 2
    );
    deckGroup.add(northFill);

    // === COBBLESTONES (InstancedMesh for performance) ===
    const stoneGeo = new THREE.BoxGeometry(0.8, 0.08, 0.8);
    const cobbleMat = material.clone();
    cobbleMat.color.set(0x8A8078);

    // Count stones for flat + both ramps
    const flatXSteps = Math.ceil(FLAT_LENGTH / 1.2);
    const rampXSteps = Math.ceil(RAMP_LENGTH / 1.2);
    const zSteps = Math.ceil((BRIDGE_WIDTH - 1) / 1.2);
    const totalCount = (flatXSteps + rampXSteps * 2) * zSteps;

    const instancedStones = new THREE.InstancedMesh(stoneGeo, cobbleMat, totalCount);
    instancedStones.castShadow = true;
    instancedStones.receiveShadow = true;

    const dummy = new THREE.Object3D();
    let idx = 0;

    // Flat section cobblestones
    for (let xi = 0; xi < flatXSteps; xi++) {
        for (let zi = 0; zi < zSteps; zi++) {
            if (idx >= totalCount) break;
            const x = -FLAT_LENGTH / 2 + xi * 1.2 + (Math.random() - 0.5) * 0.15;
            const z = -BRIDGE_WIDTH / 2 + 0.5 + zi * 1.2 + (Math.random() - 0.5) * 0.15;

            dummy.position.set(x, DECK_Y + 0.55, z);
            dummy.rotation.set(0, (Math.random() - 0.5) * 0.2, 0);
            const s = 0.8 + (Math.random() - 0.5) * 0.3;
            dummy.scale.set(s, 1, s);
            dummy.updateMatrix();

            instancedStones.setColorAt(idx, new THREE.Color().setHSL(
                0.08 + (Math.random() - 0.5) * 0.02,
                0.1 + Math.random() * 0.05,
                0.3 + (Math.random() - 0.5) * 0.08
            ));
            instancedStones.setMatrixAt(idx, dummy.matrix);
            idx++;
        }
    }

    // South ramp cobblestones (follow the slope)
    for (let xi = 0; xi < rampXSteps; xi++) {
        for (let zi = 0; zi < zSteps; zi++) {
            if (idx >= totalCount) break;
            const xLocal = xi * 1.2 + (Math.random() - 0.5) * 0.15;
            const x = -FLAT_LENGTH / 2 - xLocal;
            const y = getDeckYAtX(x) + 0.55;
            const z = -BRIDGE_WIDTH / 2 + 0.5 + zi * 1.2 + (Math.random() - 0.5) * 0.15;

            dummy.position.set(x, y, z);
            dummy.rotation.set(0, (Math.random() - 0.5) * 0.2, Math.atan2(RAMP_DROP, RAMP_LENGTH));
            const s = 0.8 + (Math.random() - 0.5) * 0.3;
            dummy.scale.set(s, 1, s);
            dummy.updateMatrix();

            instancedStones.setColorAt(idx, new THREE.Color().setHSL(
                0.08 + (Math.random() - 0.5) * 0.02,
                0.1 + Math.random() * 0.05,
                0.3 + (Math.random() - 0.5) * 0.08
            ));
            instancedStones.setMatrixAt(idx, dummy.matrix);
            idx++;
        }
    }

    // North ramp cobblestones (follow the slope)
    for (let xi = 0; xi < rampXSteps; xi++) {
        for (let zi = 0; zi < zSteps; zi++) {
            if (idx >= totalCount) break;
            const xLocal = xi * 1.2 + (Math.random() - 0.5) * 0.15;
            const x = FLAT_LENGTH / 2 + xLocal;
            const y = getDeckYAtX(x) + 0.55;
            const z = -BRIDGE_WIDTH / 2 + 0.5 + zi * 1.2 + (Math.random() - 0.5) * 0.15;

            dummy.position.set(x, y, z);
            dummy.rotation.set(0, (Math.random() - 0.5) * 0.2, -Math.atan2(RAMP_DROP, RAMP_LENGTH));
            const s = 0.8 + (Math.random() - 0.5) * 0.3;
            dummy.scale.set(s, 1, s);
            dummy.updateMatrix();

            instancedStones.setColorAt(idx, new THREE.Color().setHSL(
                0.08 + (Math.random() - 0.5) * 0.02,
                0.1 + Math.random() * 0.05,
                0.3 + (Math.random() - 0.5) * 0.08
            ));
            instancedStones.setMatrixAt(idx, dummy.matrix);
            idx++;
        }
    }

    instancedStones.count = idx;
    instancedStones.instanceMatrix.needsUpdate = true;
    if (instancedStones.instanceColor) instancedStones.instanceColor.needsUpdate = true;
    deckGroup.add(instancedStones);

    return deckGroup;
}

/**
 * Creates parapet (low wall) along bridge edge — follows ramp angle at ends
 */
function createParapet(layout, material, side) {
    const group = new THREE.Group();
    const zPos = side * (BRIDGE_WIDTH / 2 + 0.3);

    // Place parapet blocks along the full length, adjusting Y for ramps
    for (let x = -TOTAL_LENGTH / 2 + 2; x <= TOTAL_LENGTH / 2 - 2; x += 1.5) {
        const deckAtX = getDeckYAtX(x);
        const blockW = 1.2 + (Math.random() - 0.5) * 0.3;
        const blockH = PARAPET_HEIGHT + (Math.random() - 0.5) * 0.1;
        const geo = new THREE.BoxGeometry(blockW, blockH, 0.5);
        const mat = material.clone();
        const v = (Math.random() - 0.5) * 0.06;
        mat.color.r += v;
        mat.color.g += v;
        mat.color.b += v;

        const block = new THREE.Mesh(geo, mat);
        block.position.set(x, deckAtX + 0.5 + blockH / 2, zPos);
        group.add(block);
    }

    // Top cap stones — follow the slope
    for (let x = -TOTAL_LENGTH / 2 + 2; x <= TOTAL_LENGTH / 2 - 2; x += 2.0) {
        const deckAtX = getDeckYAtX(x);
        const capGeo = new THREE.BoxGeometry(1.8, 0.2, 0.7);
        const capMat = material.clone();
        capMat.color.set(0x8A8278);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(x, deckAtX + 0.5 + PARAPET_HEIGHT + 0.1, zPos);
        group.add(cap);
    }

    return group;
}

/**
 * Creates decorative lampposts — follows ramp angle at ends
 */
function createLampposts() {
    const group = new THREE.Group();

    const postMat = new THREE.MeshStandardMaterial({
        color: 0x2A2A2A,
        roughness: 0.6,
        metalness: 0.5
    });

    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xFFEECC,
        emissive: 0xFFDD88,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1
    });

    for (let x = -TOTAL_LENGTH / 2 + 10; x <= TOTAL_LENGTH / 2 - 10; x += 18) {
        const deckAtX = getDeckYAtX(x);

        for (let side = -1; side <= 1; side += 2) {
            const z = side * (BRIDGE_WIDTH / 2 + 0.3);

            // Post
            const postGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.5, 6);
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(x, deckAtX + 2.25, z);
            group.add(post);

            // Lamp head
            const lampGeo = new THREE.BoxGeometry(0.4, 0.5, 0.4);
            const lamp = new THREE.Mesh(lampGeo, glassMat);
            lamp.position.set(x, deckAtX + 4.2, z);
            group.add(lamp);

            // Top cap
            const capGeo = new THREE.ConeGeometry(0.3, 0.3, 4);
            const cap = new THREE.Mesh(capGeo, postMat);
            cap.position.set(x, deckAtX + 4.6, z);
            group.add(cap);
        }
    }

    return group;
}