import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { Cube5Faces, Grid1m, Sapata } from './TrussPieces';

const SimpleScene = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <Canvas
      shadows
      camera={{ position: [10, 10, 10], fov: 50 }}
      style={{ width: '100%', height: '100vh' }}
    >
      {/* Iluminação */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      {/* Ambiente */}
      <Environment preset="warehouse" />

      {/* Chão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.8} />
      </mesh>
      
      {/* Grid de referência */}
      <Grid
        args={[50, 50]}
        position={[0, -0.49, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#cccccc"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#999999"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Peças de exemplo */}
      <Cube5Faces
        position={[0, 0, 0]}
        isSelected={selectedPiece === 'cube'}
        onSelect={() => setSelectedPiece('cube')}
      />
      
      <Grid1m
        position={[2, 0, 0]}
        isSelected={selectedPiece === 'grid1'}
        onSelect={() => setSelectedPiece('grid1')}
      />
      
      <Sapata
        position={[-2, 0, 0]}
        isSelected={selectedPiece === 'sapata'}
        onSelect={() => setSelectedPiece('sapata')}
      />

      {/* Controles de órbita */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default SimpleScene;

