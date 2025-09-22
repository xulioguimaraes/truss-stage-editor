import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';

const BaseTrussPiece = ({ 
  children, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],
  color = '#888888',
  isSelected = false,
  isDragging = false,
  onSelect,
  onDrag,
  onDrop,
  snapPoints = [],
  ...props 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (isDragging && meshRef.current) {
      // Adiciona uma animação sutil durante o arraste
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  const handlePointerOver = () => {
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    >
      {children}
      
      {/* Indicador de seleção */}
      {isSelected && (
        <Box args={[1.1, 1.1, 1.1]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#00ff00" transparent opacity={0.3} wireframe />
        </Box>
      )}
      
      {/* Indicador de hover */}
      {hovered && !isSelected && (
        <Box args={[1.05, 1.05, 1.05]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffff00" transparent opacity={0.2} wireframe />
        </Box>
      )}
      
      {/* Pontos de encaixe */}
      {snapPoints.map((point, index) => (
        <Box
          key={index}
          args={[0.1, 0.1, 0.1]}
          position={point}
        >
          <meshBasicMaterial color="#ff0000" transparent opacity={0.5} />
        </Box>
      ))}
    </group>
  );
};

export default BaseTrussPiece;

