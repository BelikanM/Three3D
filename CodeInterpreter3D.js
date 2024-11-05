import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

function CodeInterpreter3D() {
    const [code, setCode] = useState(`// Write your 3D code here\nfunction createScene(scene) {\n  // Example:\n  const geometry = new THREE.BoxGeometry();\n  const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });\n  const cube = new THREE.Mesh(geometry, material);\n  scene.add(cube);\n  return cube;\n}`);
    const [error, setError] = useState(null);
    const [object3D, setObject3D] = useState(null);

    const executeCode = () => {
        try {
            const scene = new THREE.Scene();
            const newObject = eval(`(() => { ${code} return createScene(scene); })()`);
            setObject3D(newObject);
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', marginBottom: '1rem' }}>
                <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        minHeight: '200px',
                        border: '1px solid #ddd',
                    }}
                />
                <button onClick={executeCode} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Run Code</button>
                {error && <pre style={{ color: 'red' }}>{error}</pre>}
            </div>

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
