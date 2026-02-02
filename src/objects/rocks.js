/**
 * Minimal rocks - just some near riverbank/embankments
 */
import * as THREE from 'three';

export function createRocks() {
    const rocksGroup = new THREE.Group();
    rocksGroup.name = 'Rocks';

    const rockMat = new THREE.MeshStandardMaterial({
        color: 0x6A6A6A,
        roughness: 0.92,
        metalness: 0.08,
        flatShading: true
    });

    // Small rocks near the riverbanks
    for (let i = 0; i < 20; i++) {
        const side = Math.random() > 0.5 ? 1 : -1;
        const geo = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.5, 0);
        const rock = new THREE.Mesh(geo, rockMat.clone());
        rock.position.set(
            side * (38 + Math.random() * 5),
            -1 + Math.random() * 2,
            (Math.random() - 0.5) * 100
        );
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        rocksGroup.add(rock);
    }

    return rocksGroup;
}