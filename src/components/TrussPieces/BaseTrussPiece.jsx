import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const BaseTrussPiece = ({ 
  children, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1],
  isSelected = false,
  pieceId,
  movementMode = 'horizontal',
  onSelect,
  onDrag,
  onDrop,
  snapPoints = [],
  pieceDimensions = [1, 1, 1], // Dimensões da peça para o outline
  ...props 
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const { camera, raycaster, mouse, gl } = useThree();
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const initialMouseY = useRef(0);
  const initialHeight = useRef(0);

  const getIntersectionPoint = useCallback((event, plane = dragPlane.current) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    
    return intersection;
  }, [camera, raycaster, mouse, gl]);


  // Removido useFrame para evitar rotação indesejada durante o arraste
  // A peça deve permanecer estável durante o movimento

  const handleClick = (event) => {
    event.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  const handlePointerDown = useCallback((event) => {
    event.stopPropagation();
    
    const intersection = getIntersectionPoint(event);
    if (intersection && onDrag) {
      setIsDraggingLocal(true);
      
      if (movementMode === 'horizontal') {
        // Para movimento horizontal, usar offset normal
        dragOffset.current.copy(intersection).sub(new THREE.Vector3(...position));
        
        // Plano horizontal na altura da peça
        const clampedY = Math.max(position[1], 0);
        dragPlane.current.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, clampedY, 0)
        );
      } else {
        // Para movimento vertical, armazenar posição inicial do mouse e altura
        initialMouseY.current = event.clientY;
        initialHeight.current = position[1];
        
        // Plano vertical perpendicular à câmera
        const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
        dragPlane.current.setFromNormalAndCoplanarPoint(
          cameraDirection,
          new THREE.Vector3(...position)
        );
      }
      
      // Mudar cursor para indicar que está arrastando
      if (gl.domElement) {
        if (movementMode === 'vertical') {
          gl.domElement.style.cursor = 'ns-resize';
        } else {
          gl.domElement.style.cursor = 'grabbing';
        }
      }
    }
  }, [getIntersectionPoint, onDrag, position, gl, movementMode, camera]);


  // Event listeners globais para capturar movimento e soltura do mouse
  useEffect(() => {
    const handleGlobalPointerMove = (event) => {
      if (isDraggingLocal && onDrag) {
        if (movementMode === 'horizontal') {
          // Movimento horizontal usando interseção com plano
          const intersection = getIntersectionPoint(event);
          if (intersection) {
            const newPosition = intersection.sub(dragOffset.current);
            // Para movimento horizontal, apenas projetar no plano horizontal
            const projectedPosition = new THREE.Vector3(newPosition.x, position[1], newPosition.z);
            
            console.log('🔵 HORIZONTAL MOVEMENT:', {
              'Posição original': `X:${position[0].toFixed(3)}, Y:${position[1].toFixed(3)}, Z:${position[2].toFixed(3)}`,
              'Interseção': `X:${intersection.x.toFixed(3)}, Y:${intersection.y.toFixed(3)}, Z:${intersection.z.toFixed(3)}`,
              'Nova posição': `X:${newPosition.x.toFixed(3)}, Y:${newPosition.y.toFixed(3)}, Z:${newPosition.z.toFixed(3)}`,
              'Posição projetada': `X:${projectedPosition.x.toFixed(3)}, Y:${projectedPosition.y.toFixed(3)}, Z:${projectedPosition.z.toFixed(3)}`,
              'Array enviado': projectedPosition.toArray()
            });
            
            onDrag({ id: pieceId, position: projectedPosition.toArray() }, projectedPosition);
          }
        } else {
          // Movimento vertical simples baseado na diferença do mouse
          const mouseDelta = initialMouseY.current - event.clientY; // Invertido: mouse para cima = peça sobe
          const sensitivity = 0.005; // Sensibilidade mais baixa para controle preciso
          const heightChange = mouseDelta * sensitivity;
          const newHeight = Math.max(initialHeight.current + heightChange, 0);
          
          // Para movimento vertical, criar um Vector3 que preserve X e Z
          const projectedPosition = new THREE.Vector3(position[0], newHeight, position[2]);
          
          console.log('🟡 VERTICAL MOVEMENT:', {
            'Posição original': `X:${position[0].toFixed(3)}, Y:${position[1].toFixed(3)}, Z:${position[2].toFixed(3)}`,
            'Mouse delta': mouseDelta.toFixed(3),
            'Height change': heightChange.toFixed(6),
            'Nova altura': newHeight.toFixed(6),
            'Posição projetada': `X:${projectedPosition.x.toFixed(3)}, Y:${projectedPosition.y.toFixed(3)}, Z:${projectedPosition.z.toFixed(3)}`,
            'Array enviado': projectedPosition.toArray()
          });
          
          onDrag({ id: pieceId, position: projectedPosition.toArray() }, projectedPosition);
        }
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingLocal && onDrop) {
        onDrop({ position });
        setIsDraggingLocal(false);
        
        // Resetar cursor
        if (gl.domElement) {
          gl.domElement.style.cursor = 'default';
        }
      }
    };

    if (isDraggingLocal) {
      document.addEventListener('pointermove', handleGlobalPointerMove);
      document.addEventListener('pointerup', handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDraggingLocal, onDrag, onDrop, getIntersectionPoint, pieceId, position, gl, movementMode]);

  const handlePointerOver = () => {
    setHovered(true);
    if (gl.domElement) {
      // Cursor diferente baseado no modo
      if (movementMode === 'vertical') {
        gl.domElement.style.cursor = 'ns-resize'; // Seta vertical
      } else {
        gl.domElement.style.cursor = 'grab';
      }
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (gl.domElement) {
      gl.domElement.style.cursor = 'default';
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    >
      {children}
      
      {/* Indicador de seleção */}
      {isSelected && (
        <Box args={[
          pieceDimensions[0] + 0.1, 
          pieceDimensions[1] + 0.1, 
          pieceDimensions[2] + 0.1
        ]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#00ff00" transparent opacity={0.3} wireframe />
        </Box>
      )}
      
      {/* Indicador de hover */}
      {hovered && !isSelected && (
        <Box args={[
          pieceDimensions[0] + 0.05, 
          pieceDimensions[1] + 0.05, 
          pieceDimensions[2] + 0.05
        ]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffff00" transparent opacity={0.2} wireframe />
        </Box>
      )}
      
      {/* Pontos de encaixe - apenas quando selecionada */}
      {isSelected && snapPoints.map((point, index) => {
        // Diferentes tamanhos e cores para diferentes tipos de pontos
        const isEndPoint = Math.abs(point[0]) > 0.1; // Pontos nas extremidades
        const isVerticalPoint = Math.abs(point[1]) > 0.1; // Pontos verticais
        
        let color = "#00ff00"; // Verde padrão
        let size = 0.1;
        
        if (isEndPoint && !isVerticalPoint) {
          color = "#ff6b6b"; // Vermelho para extremidades principais
          size = 0.15;
        } else if (isVerticalPoint) {
          color = "#4ecdc4"; // Azul para pontos verticais
          size = 0.12;
        }
        
        return (
          <Box
            key={index}
            args={[size, size, size]}
            position={point}
          >
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </Box>
        );
      })}
      
      {/* Indicador de movimento vertical - apenas quando selecionada e no modo vertical */}
      {isSelected && movementMode === 'vertical' && (
        <group>
          {/* Linha vertical de referência (8 metros) */}
          <Box args={[0.05, 8, 0.05]} position={[0, 4, 0]}>
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.3} />
          </Box>
          {/* Indicador de altura atual */}
          <Box args={[0.3, 0.1, 0.3]} position={[0, position[1], 0]}>
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
          </Box>
          {/* Marcadores de altura */}
          {[0, 2, 4, 6, 8].map(height => (
            <Box key={height} args={[0.1, 0.05, 0.1]} position={[0, height, 0]}>
              <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
};

export default BaseTrussPiece;

