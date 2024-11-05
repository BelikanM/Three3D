
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedObject = ({ element }) => {
  return (
    <mesh position={[element.position.x, element.position.y, element.position.z]}>
      {element.type === 'sphere' && <sphereGeometry args={[element.size, 32, 32]} />}
      {element.type === 'box' && <boxGeometry args={[element.size, element.size, element.size]} />}
      <meshStandardMaterial color={element.color} />
    </mesh>
  );
};

const Animation3DGenerator = () => {
  const [jsonScript, setJsonScript] = useState('');
  const [parsedScript, setParsedScript] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setJsonScript(e.target.value);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonScript);
      setParsedScript(parsed);
      setError(null);
    } catch (error) {
      setError('Invalid JSON: ' + error.message);
    }
  };

  return (
    <div>
      <textarea
        value={jsonScript}
        onChange={handleInputChange}
        rows="10"
        cols="50"
        placeholder="Collez votre script JSON ici"
        style={{
          color: 'black',
          backgroundColor: 'white',
          borderColor: '#ccc',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}
      />
      <button onClick={handleJsonSubmit}>Générer l'animation</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {parsedScript && parsedScript.objects ? (
        <Canvas style={{ height: '500px', width: '100%' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <OrbitControls />
          {parsedScript.objects.map((element) => (
            <AnimatedObject key={element.id} element={element} />
          ))}
        </Canvas>
      ) : null}
    </div>
  );
};

export default Animation3DGenerator;
