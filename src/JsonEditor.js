import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './Json3DEditor.css'; // Assurez-vous de créer ce fichier CSS pour le style

const Json3DEditor = () => {
  const [sceneData, setSceneData] = useState(null);
  const sceneRef = useRef();

  const createMaterial = (materialProps) => {
    const textureLoader = new THREE.TextureLoader();
    const materialOptions = {
      color: materialProps.color || 0xffffff,
      roughness: materialProps.roughness || 1,
      metalness: materialProps.metalness || 0,
    };

    if (materialProps.map) materialOptions.map = textureLoader.load(materialProps.map);
    if (materialProps.normalMap) materialOptions.normalMap = textureLoader.load(materialProps.normalMap);
    if (materialProps.roughnessMap) materialOptions.roughnessMap = textureLoader.load(materialProps.roughnessMap);
    if (materialProps.aoMap) materialOptions.aoMap = textureLoader.load(materialProps.aoMap);

    return new THREE.MeshStandardMaterial(materialOptions);
  };

  const createObject = (objectData) => {
    let geometry;
    const material = createMaterial(objectData.material);

    switch (objectData.type) {
      case 'plane':
        geometry = new THREE.PlaneGeometry(objectData.scale.x, objectData.scale.y);
        break;
      case 'box':
        geometry = new THREE.BoxGeometry(objectData.scale.x, objectData.scale.y, objectData.scale.z);
        break;
      default:
        console.warn(`Unknown geometry type: ${objectData.type}`);
        return null;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(objectData.position.x, objectData.position.y, objectData.position.z);
    mesh.rotation.set(
      THREE.MathUtils.degToRad(objectData.rotation.x || 0),
      THREE.MathUtils.degToRad(objectData.rotation.y || 0),
      THREE.MathUtils.degToRad(objectData.rotation.z || 0)
    );

    return mesh;
  };

  useEffect(() => {
    if (sceneData && sceneRef.current) {
      // Clear previous objects
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }

      // Add new objects
      sceneData.objects.forEach((objectData) => {
        const obj = createObject(objectData);
        if (obj) sceneRef.current.add(obj);
      });
    }
  }, [sceneData]);

  const handleJsonInputChange = (event) => {
    try {
      const parsedData = JSON.parse(event.target.value);
      setSceneData(parsedData);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div className="editor-container">
      <div className="json-input-box">
        <h3>Collez votre JSON ici :</h3>
        <textarea
          rows={10}
          className="json-textarea"
          onChange={handleJsonInputChange}
          placeholder='Collez le script JSON ici...'
        />
      </div>
      <Canvas className="scene-canvas">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <OrbitControls />
        <group ref={sceneRef} />
      </Canvas>
    </div>
  );
};

export default Json3DEditor;
