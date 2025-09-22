import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import BaseTrussPiece from './BaseTrussPiece';

const Cumeeira = ({ position, rotation, scale, isSelected, pieceId, movementMode, onSelect, onDrag, onDrop }) => {
  // Pontos de encaixe nas extremidades da cumeeira
  const snapPoints = [
    [0, 0.5, 0],     // Topo da curva
    [-0.5, 0, 0],    // Extremidade esquerda
    [0.5, 0, 0],     // Extremidade direita
    [0, 0, 0.2],     // Frente
    [0, 0, -0.2],    // Trás
  ];

  // Criar geometria curva para a cumeeira
  const curvedGeometry = useMemo(() => {
    const segments = 16;
    const radius = 0.5;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI; // Meio círculo
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      points.push([x, y, 0]);
    }
    
    return points;
  }, []);

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
      pieceDimensions={[1, 0.5, 0.2]} // Largura 1, altura 0.5, profundidade 0.2
    >
      {/* Estrutura curva principal */}
      <group>
        {curvedGeometry.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = curvedGeometry[index - 1];
          const distance = Math.sqrt(
            Math.pow(point[0] - prevPoint[0], 2) + 
            Math.pow(point[1] - prevPoint[1], 2)
          );
          const midX = (point[0] + prevPoint[0]) / 2;
          const midY = (point[1] + prevPoint[1]) / 2;
          const angle = Math.atan2(point[1] - prevPoint[1], point[0] - prevPoint[0]);
          
          return (
            <Box
              key={`segment-${index}`}
              args={[distance, 0.1, 0.1]}
              position={[midX, midY, 0]}
              rotation={[0, 0, angle]}
            >
              <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
            </Box>
          );
        })}
      </group>
      
      {/* Estrutura interna do truss */}
      <group>
        {curvedGeometry.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = curvedGeometry[index - 1];
          const distance = Math.sqrt(
            Math.pow(point[0] - prevPoint[0], 2) + 
            Math.pow(point[1] - prevPoint[1], 2)
          );
          const midX = (point[0] + prevPoint[0]) / 2;
          const midY = (point[1] + prevPoint[1]) / 2;
          const angle = Math.atan2(point[1] - prevPoint[1], point[0] - prevPoint[0]);
          
          return (
            <Box
              key={`inner-segment-${index}`}
              args={[distance * 0.8, 0.05, 0.05]}
              position={[midX, midY, 0]}
              rotation={[0, 0, angle]}
            >
              <meshStandardMaterial color="#888888" wireframe />
            </Box>
          );
        })}
      </group>
      
      {/* Conectores nas extremidades */}
      {snapPoints.slice(0, 3).map((point, index) => (
        <Box
          key={`end-connector-${index}`}
          args={[0.15, 0.15, 0.15]}
          position={point}
        >
          <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
        </Box>
      ))}
      
      {/* Reforços estruturais */}
      {[0.25, 0.5, 0.75].map((t, index) => {
        const angle = t * Math.PI;
        const x = Math.cos(angle) * 0.4;
        const y = Math.sin(angle) * 0.4;
        return (
          <Box
            key={`reinforcement-${index}`}
            args={[0.05, 0.3, 0.05]}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
          >
            <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.2} />
          </Box>
        );
      })}
    </BaseTrussPiece>
  );
};

export default Cumeeira;

