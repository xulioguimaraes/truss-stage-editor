import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei';
import { useSnapping } from '../hooks/useSnapping';
import { useDragControls } from '../hooks/useDragControls';
import * as THREE from 'three';

// Importar todos os componentes de peças
import {
  Cube5Faces,
  Grid0_5m,
  Grid1m,
  Grid2m,
  Grid3m,
  Grid4m,
  Sapata,
  Cumeeira
} from './TrussPieces';

// Componente para renderizar uma peça individual
const TrussPiece = ({ piece, isSelected, movementMode, onSelect, onDrag, onDrop, snapPreview }) => {
  const ComponentMap = {
    Cube5Faces,
    Grid0_5m,
    Grid1m,
    Grid2m,
    Grid3m,
    Grid4m,
    Sapata,
    Cumeeira
  };

  const Component = ComponentMap[piece.type];
  
  if (!Component) {
    console.warn(`Componente não encontrado para o tipo: ${piece.type}`);
    return null;
  }

  const handleClick = (event) => {
    event.stopPropagation();
    onSelect(piece.id);
  };

  return (
    <group
      position={piece.position}
      rotation={piece.rotation}
      scale={piece.scale}
      onClick={handleClick}
    >
      <Component
        position={piece.position}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
        isSelected={isSelected}
        pieceId={piece.id}
        movementMode={movementMode}
        onSelect={() => onSelect(piece.id)}
        onDrag={onDrag}
        onDrop={onDrop}
      />
    </group>
  );
};

// Componente para o chão e grid de referência
const Ground = () => {
  return (
    <group>
      {/* Chão principal */}
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
    </group>
  );
};

// Componente principal da cena
const SceneContent = ({ 
  pieces, 
  selectedPiece, 
  draggingPiece, 
  movementMode,
  onSelect, 
  onUpdatePiece, 
  onStartDrag, 
  onEndDrag 
}) => {
  const { snapToNearest, getSnapPreview } = useSnapping(pieces);
  const [snapPreview, setSnapPreview] = useState(null);
  const [isDraggingPiece, setIsDraggingPiece] = useState(false);

  const handleDrag = useCallback((piece, newPosition) => {
    // Se piece tem um id, é uma peça existente sendo arrastada
    if (piece && piece.id !== undefined) {
      console.log('🟢 SCENE3D RECEIVED:', {
        'Piece ID': piece.id,
        'NewPosition (input)': newPosition,
        'NewPosition type': typeof newPosition,
        'NewPosition isArray': Array.isArray(newPosition),
        'NewPosition values': Array.isArray(newPosition) ? 
          `X:${newPosition[0]?.toFixed(3)}, Y:${newPosition[1]?.toFixed(3)}, Z:${newPosition[2]?.toFixed(3)}` :
          `X:${newPosition.x?.toFixed(3)}, Y:${newPosition.y?.toFixed(3)}, Z:${newPosition.z?.toFixed(3)}`
      });
      
      setIsDraggingPiece(true);
      const snappedPosition = snapToNearest(newPosition, piece.id);
      
      console.log('🟢 SCENE3D SNAPPED:', {
        'SnappedPosition': snappedPosition,
        'SnappedPosition type': typeof snappedPosition,
        'SnappedPosition isArray': Array.isArray(snappedPosition),
        'SnappedPosition values': Array.isArray(snappedPosition) ? 
          `X:${snappedPosition[0]?.toFixed(3)}, Y:${snappedPosition[1]?.toFixed(3)}, Z:${snappedPosition[2]?.toFixed(3)}` :
          `X:${snappedPosition.x?.toFixed(3)}, Y:${snappedPosition.y?.toFixed(3)}, Z:${snappedPosition.z?.toFixed(3)}`
      });
      
      // Garantir que a posição seja um array válido
      const positionArray = Array.isArray(snappedPosition) ? snappedPosition : snappedPosition.toArray();
      
      console.log('🟢 SCENE3D FINAL:', {
        'PositionArray': positionArray,
        'PositionArray values': `X:${positionArray[0]?.toFixed(3)}, Y:${positionArray[1]?.toFixed(3)}, Z:${positionArray[2]?.toFixed(3)}`,
        'Action': 'Sending to onUpdatePiece...'
      });
      
      onUpdatePiece(piece.id, { position: positionArray });
      
      // Atualizar preview de encaixe
      const preview = getSnapPreview(newPosition, piece.id);
      setSnapPreview(preview);
    }
  }, [snapToNearest, getSnapPreview, onUpdatePiece]);

  const handleDragEnd = useCallback((piece) => {
    setIsDraggingPiece(false);
    onEndDrag();
    setSnapPreview(null);
  }, [onEndDrag]);

  // Handler para deselecionar peça ao clicar em área vazia
  const handleSceneClick = useCallback((event) => {
    console.log('🟡 SCENE CLICK: Deselecting piece');
    onSelect(null);
  }, [onSelect]);

  return (
    <>
      {/* Plano invisível para capturar cliques em área vazia */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleSceneClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Iluminação */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Ambiente */}
      <Environment preset="warehouse" />

      {/* Chão */}
      <Ground />

      {/* Peças do truss */}
      {pieces.map((piece) => (
        <TrussPiece
          key={piece.id}
          piece={piece}
          isSelected={selectedPiece === piece.id}
          movementMode={movementMode}
          onSelect={onSelect}
          onDrag={handleDrag}
          onDrop={handleDragEnd}
          snapPreview={snapPreview}
        />
      ))}

      {/* Preview de encaixe */}
      {snapPreview && (
        <mesh position={snapPreview.point.toArray()}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Controles de órbita */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={!isDraggingPiece}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Componente principal da cena 3D
const Scene3D = ({ 
  pieces, 
  selectedPiece, 
  draggingPiece, 
  movementMode,
  onSelect, 
  onUpdatePiece, 
  onStartDrag, 
  onEndDrag 
}) => {
  return (
    <Canvas
      shadows
      camera={{ position: [10, 10, 10], fov: 50 }}
      style={{ width: '100%', height: '100vh' }}
    >
      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <SceneContent
        pieces={pieces}
        selectedPiece={selectedPiece}
        draggingPiece={draggingPiece}
        movementMode={movementMode}
        onSelect={onSelect}
        onUpdatePiece={onUpdatePiece}
        onStartDrag={onStartDrag}
        onEndDrag={onEndDrag}
      />
    </Canvas>
  );
};

export default Scene3D;
