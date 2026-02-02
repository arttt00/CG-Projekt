
import * as THREE from 'three';

const BAZAAR_X = 80; // North side (positive X = north bank)
const BAZAAR_Z = 0;

export function createOldBazaar() {
    const bazaarGroup = new THREE.Group();
    bazaarGroup.name = 'OldBazaar';

    // ---- COBBLESTONE STREETS ----
    const streets = createBazaarStreets();
    bazaarGroup.add(streets);

    // ---- OTTOMAN SHOPS ----
    const shops = createOttomanShops();
    bazaarGroup.add(shops);

    // ---- DAUT PASHA HAMMAM ----
    const hammam = createDautPashaHammam();
    bazaarGroup.add(hammam);

    // ---- MUSTAFA PASHA MOSQUE ----
    const mosque = createMosque();
    bazaarGroup.add(mosque);

    // ---- BEZISTEN (covered market) ----
    const bezisten = createBezisten();
    bazaarGroup.add(bezisten);

    // ---- KALE FORTRESS (on the hill above) ----
    const fortress = createKaleFortress();
    bazaarGroup.add(fortress);

    bazaarGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return bazaarGroup;
}

function createBazaarStreets() {
    const group = new THREE.Group();

    const cobbleMat = new THREE.MeshStandardMaterial({
        color: 0x8A8070,
        roughness: 0.95,
        metalness: 0.02
    });

    // Main bazaar ground
    const mainGeo = new THREE.PlaneGeometry(100, 140);
    const mainGround = new THREE.Mesh(mainGeo, cobbleMat);
    mainGround.rotation.x = -Math.PI / 2;
    mainGround.position.set(BAZAAR_X + 10, 2.1, BAZAAR_Z);
    group.add(mainGround);

    // Cobblestone details on main streets
    for (let x = BAZAAR_X - 5; x < BAZAAR_X + 60; x += 1.0) {
        for (let z = -40; z < 40; z += 1.0) {
            if (Math.random() > 0.3) {
                const stoneGeo = new THREE.BoxGeometry(
                    0.5 + Math.random() * 0.3,
                    0.05,
                    0.5 + Math.random() * 0.3
                );
                const stoneMat = cobbleMat.clone();
                const v = (Math.random() - 0.5) * 0.08;
                stoneMat.color.r += v;
                stoneMat.color.g += v;
                stoneMat.color.b += v;

                const stone = new THREE.Mesh(stoneGeo, stoneMat);
                stone.position.set(x, 2.15, z);
                stone.rotation.y = Math.random() * 0.3;
                group.add(stone);
            }
        }
    }

    return group;
}

function createOttomanShops() {
    const group = new THREE.Group();

    const shopWallColors = [0xD8C8A8, 0xC8B898, 0xE0D0B0, 0xB8A888, 0xD0C0A0];
    const woodTrimMat = new THREE.MeshStandardMaterial({
        color: 0x5A3A1A,
        roughness: 0.85,
        metalness: 0.05
    });
    const roofTileMat = new THREE.MeshStandardMaterial({
        color: 0x9A4A2A,
        roughness: 0.8,
        metalness: 0.05,
        flatShading: true
    });
    const doorMat = new THREE.MeshStandardMaterial({
        color: 0x4A2A0A,
        roughness: 0.8
    });

    // Streets of shops (arranged in rows like real bazaar)
    const shopRows = [
        { z: -35, count: 8, facing: 1 },
        { z: -25, count: 8, facing: -1 },
        { z: -15, count: 9, facing: 1 },
        { z: -5, count: 9, facing: -1 },
        { z: 5, count: 9, facing: 1 },
        { z: 15, count: 9, facing: -1 },
        { z: 25, count: 8, facing: 1 },
        { z: 35, count: 8, facing: -1 },
    ];

    shopRows.forEach((row) => {
        for (let i = 0; i < row.count; i++) {
            const shopWidth = 4 + Math.random() * 2;
            const shopHeight = 4 + Math.random() * 2;
            const shopDepth = 5 + Math.random() * 3;

            const shop = createSingleShop(
                shopWidth, shopHeight, shopDepth,
                shopWallColors[Math.floor(Math.random() * shopWallColors.length)],
                woodTrimMat, roofTileMat, doorMat,
                row.facing
            );

            shop.position.set(
                BAZAAR_X + 5 + i * (shopWidth + 1),
                2,
                row.z + row.facing * 3
            );

            group.add(shop);
        }
    });

    return group;
}

function createSingleShop(width, height, depth, wallColor, woodTrimMat, roofMat, doorMat, facing) {
    const shop = new THREE.Group();

    const wallMat = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.85,
        metalness: 0.02
    });

    // Main walls
    const bodyGeo = new THREE.BoxGeometry(width, height, depth);
    const body = new THREE.Mesh(bodyGeo, wallMat);
    body.position.y = height / 2;
    shop.add(body);

    // Pitched roof (Ottoman style - red clay tiles)
    const roofGeo = new THREE.BoxGeometry(width + 0.6, 0.3, depth + 0.6);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = height;
    shop.add(roof);

    // Roof ridge
    const ridgeShape = new THREE.Shape();
    ridgeShape.moveTo(-width / 2 - 0.3, 0);
    ridgeShape.lineTo(0, 2);
    ridgeShape.lineTo(width / 2 + 0.3, 0);
    ridgeShape.closePath();

    const ridgeGeo = new THREE.ExtrudeGeometry(ridgeShape, {
        depth: depth + 0.5,
        bevelEnabled: false
    });
    const ridge = new THREE.Mesh(ridgeGeo, roofMat);
    ridge.rotation.y = Math.PI / 2;
    ridge.position.set(0, height, -depth / 2 - 0.25);
    shop.add(ridge);

    // Wooden shop front
    const frontGeo = new THREE.BoxGeometry(width - 0.3, height * 0.6, 0.15);
    const front = new THREE.Mesh(frontGeo, woodTrimMat);
    front.position.set(0, height * 0.3, facing * depth / 2);
    shop.add(front);

    // Door
    const doorGeo = new THREE.BoxGeometry(1.2, 2.2, 0.2);
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.1, facing * (depth / 2 + 0.05));
    shop.add(door);

    // Window shutters
    const shutterGeo = new THREE.BoxGeometry(0.8, 1.0, 0.1);
    const shutterMat = woodTrimMat.clone();
    shutterMat.color.set(0x3A6A3A);

    for (let s = -1; s <= 1; s += 2) {
        const shutter = new THREE.Mesh(shutterGeo, shutterMat);
        shutter.position.set(s * 1.5, 2.8, facing * (depth / 2 + 0.05));
        shop.add(shutter);
    }

    // Awning/overhang
    const awningGeo = new THREE.BoxGeometry(width + 0.5, 0.08, 1.5);
    const awningMat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x8B4513 : 0xA0522D,
        roughness: 0.9
    });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(0, height * 0.6, facing * (depth / 2 + 0.7));
    awning.rotation.x = facing * 0.15;
    shop.add(awning);

    return shop;
}

function createDautPashaHammam() {
    const group = new THREE.Group();
    group.name = 'DautPashaHammam';

    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xC8B898,
        roughness: 0.7,
        metalness: 0.05
    });
    const domeMat = new THREE.MeshStandardMaterial({
        color: 0x7A7A7A,
        roughness: 0.6,
        metalness: 0.15
    });

    const hammamX = BAZAAR_X + 15;
    const hammamZ = BAZAAR_Z + 50;

    // Main rectangular body
    const bodyGeo = new THREE.BoxGeometry(25, 8, 20);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(hammamX, 6, hammamZ);
    group.add(body);

    // Multiple domes (characteristic of Ottoman hammams)
    const domePositions = [
        { x: 0, z: 0, r: 5, h: 4 },   // Main dome
        { x: -6, z: -4, r: 3, h: 3 },  // Side domes
        { x: 6, z: -4, r: 3, h: 3 },
        { x: -6, z: 4, r: 3, h: 3 },
        { x: 6, z: 4, r: 3, h: 3 },
        { x: 0, z: -6, r: 2.5, h: 2.5 },
        { x: 0, z: 6, r: 2.5, h: 2.5 },
    ];

    domePositions.forEach((pos) => {
        const domeGeo = new THREE.SphereGeometry(pos.r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, domeMat);
        dome.position.set(
            hammamX + pos.x,
            10 + (pos.r - 3) * 0.5,
            hammamZ + pos.z
        );
        group.add(dome);
    });

    // Entrance portal
    const portalGeo = new THREE.BoxGeometry(5, 10, 3);
    const portal = new THREE.Mesh(portalGeo, stoneMat);
    portal.position.set(hammamX, 7, hammamZ - 11);
    group.add(portal);

    // Portal arch
    const archGeo = new THREE.TorusGeometry(2, 0.3, 8, 12, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, stoneMat);
    archMesh.position.set(hammamX, 7, hammamZ - 12.3);
    group.add(archMesh);

    return group;
}

function createMosque() {
    const group = new THREE.Group();
    group.name = 'MustafaPashaMosque';

    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xD8D0C0,
        roughness: 0.6,
        metalness: 0.05
    });
    const domeMat = new THREE.MeshStandardMaterial({
        color: 0x7A7A7A,
        roughness: 0.5,
        metalness: 0.2
    });
    const minaretMat = new THREE.MeshStandardMaterial({
        color: 0xE0D8C8,
        roughness: 0.5,
        metalness: 0.1
    });

    const mosqueX = BAZAAR_X + 50;
    const mosqueZ = BAZAAR_Z - 40;

    // Main prayer hall (cubic)
    const hallGeo = new THREE.BoxGeometry(18, 12, 18);
    const hall = new THREE.Mesh(hallGeo, stoneMat);
    hall.position.set(mosqueX, 8, mosqueZ);
    group.add(hall);

    // Main dome
    const mainDomeGeo = new THREE.SphereGeometry(8, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const mainDome = new THREE.Mesh(mainDomeGeo, domeMat);
    mainDome.position.set(mosqueX, 14, mosqueZ);
    group.add(mainDome);

    // Dome finial (alem)
    const alemGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 6);
    const alem = new THREE.Mesh(alemGeo, new THREE.MeshStandardMaterial({
        color: 0xC8A050,
        metalness: 0.8,
        roughness: 0.2
    }));
    alem.position.set(mosqueX, 23, mosqueZ);
    group.add(alem);

    // Crescent on top
    const crescentGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 16, Math.PI * 1.5);
    const crescent = new THREE.Mesh(crescentGeo, alem.material);
    crescent.position.set(mosqueX, 24.2, mosqueZ);
    crescent.rotation.z = Math.PI / 4;
    group.add(crescent);

    // Minaret
    const minaretBaseGeo = new THREE.CylinderGeometry(1.2, 1.5, 4, 8);
    const minaretBase = new THREE.Mesh(minaretBaseGeo, minaretMat);
    minaretBase.position.set(mosqueX - 12, 4, mosqueZ - 8);
    group.add(minaretBase);

    const minaretShaftGeo = new THREE.CylinderGeometry(0.8, 1.0, 30, 8);
    const minaretShaft = new THREE.Mesh(minaretShaftGeo, minaretMat);
    minaretShaft.position.set(mosqueX - 12, 21, mosqueZ - 8);
    group.add(minaretShaft);

    // Şerefe (balcony on minaret)
    const balconyGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.5, 12);
    const balcony = new THREE.Mesh(balconyGeo, minaretMat);
    balcony.position.set(mosqueX - 12, 33, mosqueZ - 8);
    group.add(balcony);

    // Minaret top section
    const topShaftGeo = new THREE.CylinderGeometry(0.5, 0.7, 5, 8);
    const topShaft = new THREE.Mesh(topShaftGeo, minaretMat);
    topShaft.position.set(mosqueX - 12, 36, mosqueZ - 8);
    group.add(topShaft);

    // Conical cap
    const capGeo = new THREE.ConeGeometry(0.8, 3, 8);
    const cap = new THREE.Mesh(capGeo, domeMat);
    cap.position.set(mosqueX - 12, 40, mosqueZ - 8);
    group.add(cap);

    // Courtyard walls
    const courtWallGeo = new THREE.BoxGeometry(22, 5, 0.5);
    const courtWall1 = new THREE.Mesh(courtWallGeo, stoneMat);
    courtWall1.position.set(mosqueX, 4.5, mosqueZ - 10);
    group.add(courtWall1);

    const courtWallGeo2 = new THREE.BoxGeometry(0.5, 5, 20);
    const courtWall2 = new THREE.Mesh(courtWallGeo2, stoneMat);
    courtWall2.position.set(mosqueX - 11, 4.5, mosqueZ);
    group.add(courtWall2);

    // Arched windows
    for (let i = -2; i <= 2; i++) {
        const winGeo = new THREE.PlaneGeometry(1.5, 3);
        const winMat = new THREE.MeshStandardMaterial({
            color: 0x3A5A7A,
            transparent: true,
            opacity: 0.4
        });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(mosqueX + 9.05, 8, mosqueZ + i * 4);
        win.rotation.y = Math.PI / 2;
        group.add(win);
    }

    return group;
}

function createBezisten() {
    const group = new THREE.Group();
    group.name = 'Bezisten';

    const stoneMat = new THREE.MeshStandardMaterial({
        color: 0xB8A888,
        roughness: 0.8,
        metalness: 0.05
    });
    const roofMat = new THREE.MeshStandardMaterial({
        color: 0x7A7A7A,
        roughness: 0.7,
        metalness: 0.1
    });

    const bezX = BAZAAR_X + 25;
    const bezZ = BAZAAR_Z - 15;

    // Rectangular covered market
    const bodyGeo = new THREE.BoxGeometry(20, 6, 30);
    const body = new THREE.Mesh(bodyGeo, stoneMat);
    body.position.set(bezX, 5, bezZ);
    group.add(body);

    // Barrel vault roof
    const vaultGeo = new THREE.CylinderGeometry(10, 10, 32, 16, 1, false, 0, Math.PI);
    const vault = new THREE.Mesh(vaultGeo, roofMat);
    vault.rotation.z = Math.PI / 2;
    vault.rotation.y = Math.PI / 2;
    vault.position.set(bezX, 8, bezZ);
    group.add(vault);

    // Entrance arches
    for (let side = -1; side <= 1; side += 2) {
        const archGeo = new THREE.TorusGeometry(2, 0.3, 8, 12, Math.PI);
        const arch = new THREE.Mesh(archGeo, stoneMat);
        arch.position.set(bezX, 4, bezZ + side * 15.5);
        group.add(arch);
    }

    return group;
}

function createKaleFortress() {
    const group = new THREE.Group();
    group.name = 'KaleFortress';

    const fortMat = new THREE.MeshStandardMaterial({
        color: 0x8A7A6A,
        roughness: 0.92,
        metalness: 0.05,
        flatShading: true
    });

    const fortX = BAZAAR_X + 60;
    const fortZ = BAZAAR_Z - 20;
    const hillHeight = 15;

    // Hill (Kale sits on a hill)
    const hillGeo = new THREE.ConeGeometry(50, hillHeight, 12);
    const hillMat = new THREE.MeshStandardMaterial({
        color: 0x5A6A4A,
        roughness: 0.95,
        flatShading: true
    });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(fortX, hillHeight / 2 + 2, fortZ);
    group.add(hill);

    // Fortress walls
    const wallHeight = 10;
    const wallThickness = 2;

    // North wall
    const northWallGeo = new THREE.BoxGeometry(40, wallHeight, wallThickness);
    const northWall = new THREE.Mesh(northWallGeo, fortMat);
    northWall.position.set(fortX, hillHeight + wallHeight / 2, fortZ - 18);
    group.add(northWall);

    // South wall
    const southWall = new THREE.Mesh(northWallGeo.clone(), fortMat);
    southWall.position.set(fortX, hillHeight + wallHeight / 2, fortZ + 18);
    group.add(southWall);

    // East wall
    const eastWallGeo = new THREE.BoxGeometry(wallThickness, wallHeight, 36);
    const eastWall = new THREE.Mesh(eastWallGeo, fortMat);
    eastWall.position.set(fortX + 20, hillHeight + wallHeight / 2, fortZ);
    group.add(eastWall);

    // West wall
    const westWall = new THREE.Mesh(eastWallGeo.clone(), fortMat);
    westWall.position.set(fortX - 20, hillHeight + wallHeight / 2, fortZ);
    group.add(westWall);

    // Towers at corners
    const towerPositions = [
        { x: 20, z: -18 }, { x: -20, z: -18 },
        { x: 20, z: 18 }, { x: -20, z: 18 }
    ];

    towerPositions.forEach((pos) => {
        const towerGeo = new THREE.CylinderGeometry(3, 3.5, wallHeight + 4, 8);
        const tower = new THREE.Mesh(towerGeo, fortMat);
        tower.position.set(
            fortX + pos.x,
            hillHeight + (wallHeight + 4) / 2,
            fortZ + pos.z
        );
        group.add(tower);

        // Tower cap
        const capGeo = new THREE.ConeGeometry(3.5, 3, 8);
        const cap = new THREE.Mesh(capGeo, fortMat);
        cap.position.set(
            fortX + pos.x,
            hillHeight + wallHeight + 5,
            fortZ + pos.z
        );
        group.add(cap);
    });

    // Flag
    const flagPoleGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 4);
    const flagPoleMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const flagPole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
    flagPole.position.set(fortX, hillHeight + wallHeight + 8, fortZ);
    group.add(flagPole);

    const flagGeo = new THREE.PlaneGeometry(3, 2);
    const flagMat = new THREE.MeshStandardMaterial({
        color: 0xCC0000,
        side: THREE.DoubleSide,
        roughness: 0.9
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(fortX + 1.5, hillHeight + wallHeight + 11, fortZ);
    group.add(flag);

    return group;
}