import React from 'react';
import { Box } from '@react-three/drei';
import BaseTrussPiece from './BaseTrussPiece';

const Cube5Faces = ({ position, rotation, scale, isSelected, isDragging, onSelect, onDrag, onDrop }) => {
  // Pontos de encaixe nas 5 faces (excluindo a base)
  const snapPoints = [
    [0, 0.5, 0],    // Topo
    [0.5, 0, 0],    // Direita
    [-0.5, 0, 0],   // Esquerda
    [0, 0, 0.5],    // Frente
    [0, 0, -0.5],   // Trás
  ];

  return (
    <BaseTrussPiece
      position={position}
      rotation={rotation}
      scale={scale}
      isSelected={isSelected}
      isDragging={isDragging}
      onSelect={onSelect}
      onDrag={onDrag}
      onDrop={onDrop}
      snapPoints={snapPoints}
    >
      {/* Cubo principal */}
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Estrutura interna do truss */}
      <Box args={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888888" wireframe />
      </Box>
      
      {/* Conectores nas faces */}
      {snapPoints.map((point, index) => (
        <Box
          key={`connector-${index}`}
          args={[0.2, 0.2, 0.2]}
          position={point}
        >
          <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
    </BaseTrussPiece>
  );
};

export default Cube5Faces;

