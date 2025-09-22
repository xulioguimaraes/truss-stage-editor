import React from 'react';
import { Box } from '@react-three/drei';
import BaseTrussPiece from './BaseTrussPiece';

const Grid = ({ 
  length = 1, 
  position, 
  rotation, 
  scale, 
  isSelected, 
  isDragging, 
  onSelect, 
  onDrag, 
  onDrop 
}) => {
  // Pontos de encaixe nas extremidades
  const snapPoints = [
    [length/2, 0, 0],    // Extremidade direita
    [-length/2, 0, 0],   // Extremidade esquerda
    [0, 0.2, 0],         // Topo
    [0, -0.2, 0],        // Base
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
      {/* Estrutura principal do grid */}
      <Box args={[length, 0.4, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Estrutura interna do truss */}
      <Box args={[length * 0.8, 0.3, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888888" wireframe />
      </Box>
      
      {/* Barras transversais */}
      {Array.from({ length: Math.floor(length) + 1 }, (_, i) => {
        const x = (i - Math.floor(length) / 2) * (length / Math.floor(length));
        return (
          <Box
            key={`cross-${i}`}
            args={[0.05, 0.4, 0.05]}
            position={[x, 0, 0]}
          >
            <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
          </Box>
        );
      })}
      
      {/* Conectores nas extremidades */}
      {snapPoints.slice(0, 2).map((point, index) => (
        <Box
          key={`end-connector-${index}`}
          args={[0.2, 0.2, 0.2]}
          position={point}
        >
          <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
    </BaseTrussPiece>
  );
};

export default Grid;

