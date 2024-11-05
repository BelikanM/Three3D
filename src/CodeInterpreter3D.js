import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ScriptEditor from './ScriptEditor';

function CodeInterpreter3D() {
    const [objectConfig, setObjectConfig] = useState({
        geometry: "box",
        material: { color: "#0077ff" },
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    });

    const applyScript = (config) => {
        setObjectConfig(config);
    };

    const createObject = () => {
        let geometry;

        switch (objectConfig.geometry.toLowerCase()) {
            case 'box':
                geometry = new THREE.BoxGeometry();
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(1, 2, 32);
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(5, 5);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
            default:
                geometry = new THREE.BoxGeometry(); // géométrie par défaut si non reconnue
                break;
        }

        const material = new THREE.MeshStandardMaterial({
            color: objectConfig.material?.color || '#0077ff',
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...(objectConfig.position || [0, 0, 0]));
        mesh.rotation.set(...(objectConfig.rotation || [0, 0, 0]));
        mesh.scale.set(...(objectConfig.scale || [1, 1, 1]));
        return mesh;
    };

    const object3D = createObject();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScriptEditor onApplyScript={applyScript} />

            <Canvas style={{ width: '100%', height: '400px', backgroundColor: '#282c34' }}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {object3D && <primitive object={object3D} />}
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default CodeInterpreter3D;
