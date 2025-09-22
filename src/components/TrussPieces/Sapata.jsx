import React from 'react';
import { Box, Cylinder } from '@react-three/drei';
import BaseTrussPiece from './BaseTrussPiece';

const Sapata = ({ position, rotation, scale, isSelected, isDragging, onSelect, onDrag, onDrop }) => {
  // Pontos de encaixe no topo da sapata
  const snapPoints = [
    [0, 0.3, 0],    // Centro do topo
    [0.2, 0.3, 0],  // Lado direito
    [-0.2, 0.3, 0], // Lado esquerdo
    [0, 0.3, 0.2],  // Frente
    [0, 0.3, -0.2], // Trás
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
      {/* Base quadrada da sapata */}
      <Box args={[0.8, 0.2, 0.8]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Pilar central */}
      <Cylinder args={[0.1, 0.15, 0.4]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Placa de conexão no topo */}
      <Box args={[0.4, 0.05, 0.4]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Conectores de encaixe */}
      {snapPoints.map((point, index) => (
        <Box
          key={`connector-${index}`}
          args={[0.1, 0.1, 0.1]}
          position={point}
        >
          <meshStandardMaterial color="#666666" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
      
      {/* Parafusos de fixação */}
      {[
        [0.3, -0.1, 0.3],
        [-0.3, -0.1, 0.3],
        [0.3, -0.1, -0.3],
        [-0.3, -0.1, -0.3]
      ].map((pos, index) => (
        <Cylinder
          key={`bolt-${index}`}
          args={[0.02, 0.02, 0.1]}
          position={pos}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
        </Cylinder>
      ))}
    </BaseTrussPiece>
  );
};

export default Sapata;

