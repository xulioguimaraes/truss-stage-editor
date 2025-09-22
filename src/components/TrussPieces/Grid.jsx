import React from 'react';
import { Box } from '@react-three/drei';
import BaseTrussPiece from './BaseTrussPiece';

const Grid = ({ 
  length = 1, 
  position, 
  rotation, 
  scale, 
  isSelected, 
  pieceId,
  movementMode,
  onSelect, 
  onDrag, 
  onDrop 
}) => {
  // Pontos de encaixe nas extremidades (correspondem aos pontos de snapping)
  const snapPoints = [
    // Pontos de encaixe nas extremidades (principais para conexão)
    [length/2, 0, 0],    // Extremidade direita
    [-length/2, 0, 0],   // Extremidade esquerda
    
    // Pontos de encaixe verticais (para conexões em altura)
    [length/2, 0.2, 0],  // Topo da extremidade direita
    [-length/2, 0.2, 0], // Topo da extremidade esquerda
    [length/2, -0.2, 0], // Base da extremidade direita
    [-length/2, -0.2, 0], // Base da extremidade esquerda
    
    // Pontos de encaixe no centro (para conexões centrais)
    [0, 0.2, 0],         // Topo central
    [0, -0.2, 0],        // Base central
  ];

  return (
    <BaseTrussPiece
      position={position}
      rotation={rotation}
      scale={scale}
      isSelected={isSelected}
      pieceId={pieceId}
      movementMode={movementMode}
      onSelect={onSelect}
      onDrag={onDrag}
      onDrop={onDrop}
      snapPoints={snapPoints}
      pieceDimensions={[length, 0.4, 0.4]} // Dimensões reais da peça
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

