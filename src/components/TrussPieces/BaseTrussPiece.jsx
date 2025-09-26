import React, { useRef, useState, useCallback, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Box, Text } from "@react-three/drei";
import * as THREE from "three";

const BaseTrussPiece = ({
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  isSelected = false,
  isMultiSelected = false,
  isLocked = false,
  pieceId,
  movementMode = "horizontal",
  onSelect,
  onToggleSelection,
  onDrag,
  onDrop,
  snapPoints = [],
  pieceDimensions = [1, 1, 1], // Dimensões da peça para o outline
  worldPosition = [0, 0, 0], // Posição mundial da peça

  ...props
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);
  const { camera, raycaster, mouse, gl } = useThree();

  // Debug: Log lock status
  if (isLocked) {
    //console.log('🔒 BASETRUSSPIECE LOCKED:', { 'PieceId': pieceId, 'IsLocked': isLocked });
  }

  // Função para obter a posição mundial real do grupo pai
  const getWorldPosition = useCallback(() => {
    if (groupRef.current && groupRef.current.parent) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.parent.getWorldPosition(worldPosition);
      return [worldPosition.x, worldPosition.y, worldPosition.z];
    }
    return [0, 0, 0];
  }, []);

  // Função para obter a rotação mundial real do grupo pai
  const getWorldRotation = useCallback(() => {
    if (groupRef.current && groupRef.current.parent) {
      const parentRotation = groupRef.current.parent.rotation;
      return [parentRotation.x, parentRotation.y, parentRotation.z];
    }
    return [0, 0, 0];
  }, []);

  // Debug: Log received props and actual world values
  const actualWorldPosition = getWorldPosition();

  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const initialMouseY = useRef(0);
  const initialHeight = useRef(0);

  // Função para obter o plano de arraste - sempre horizontal para movimento X-Z
  const getDragPlane = useCallback(() => {
    // Sempre usar plano horizontal para movimento X-Z, independente da rotação
    return new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  }, []);

  const getIntersectionPoint = useCallback(
    (event, plane = null) => {
      // Usar o plano correto baseado na rotação
      const correctPlane = plane || getDragPlane();
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);

      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(correctPlane, intersection);

      return intersection;
    },
    [camera, raycaster, mouse, gl, getDragPlane]
  );

  // Removido useFrame para evitar rotação indesejada durante o arraste
  // A peça deve permanecer estável durante o movimento

  const handleClick = (event) => {
    event.stopPropagation();

    // Verificar se Ctrl/Cmd está pressionado para seleção múltipla
    if (event.ctrlKey || event.metaKey) {
      if (onToggleSelection) {
        onToggleSelection();
      }
    } else {
      if (onSelect) {
        onSelect();
      }
    }
  };

  const handlePointerDown = useCallback(
    (event) => {
      event.stopPropagation();
      console.log("🔒 PIECE LOCKED - Drag blocked", isLocked);
      console.log(event)
      // Se a peça está bloqueada, não permitir arrastar
      if (isLocked === true) {
        //console.log('🔒 PIECE LOCKED - Drag blocked');
        return;
      }

      const intersection = getIntersectionPoint(event);
      if (intersection && onDrag) {
        setIsDraggingLocal(true);

        if (movementMode === "horizontal") {
          // Para movimento horizontal, usar offset normal
          const currentWorldPosition = getWorldPosition(); // Use getWorldPosition function
          dragOffset.current
            .copy(intersection)
            .sub(new THREE.Vector3(...currentWorldPosition));

          // Plano horizontal na altura da peça
          const clampedY = Math.max(currentWorldPosition[1], 0);
          dragPlane.current.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, clampedY, 0)
          );
        } else {
          // Para movimento vertical, armazenar posição inicial do mouse e altura
          const currentWorldPosition = getWorldPosition(); // Use getWorldPosition function
          initialMouseY.current = event.clientY;
          initialHeight.current = currentWorldPosition[1];

          // Plano vertical perpendicular à câmera
          const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
          dragPlane.current.setFromNormalAndCoplanarPoint(
            cameraDirection,
            new THREE.Vector3(...currentWorldPosition)
          );
        }

        // Mudar cursor para indicar que está arrastando
        if (gl.domElement) {
          if (movementMode === "vertical") {
            gl.domElement.style.cursor = "ns-resize";
          } else {
            gl.domElement.style.cursor = "grabbing";
          }
        }
      }
    },
    [
      getIntersectionPoint,
      onDrag,
      getWorldPosition,
      gl,
      movementMode,
      camera,
      isLocked,
    ]
  );

  // Event listeners globais para capturar movimento e soltura do mouse
  useEffect(() => {
    const handleGlobalPointerMove = (event) => {
      if (isDraggingLocal && onDrag && !isLocked) {
        if (movementMode === "horizontal") {
          // Movimento horizontal usando interseção com plano
          const intersection = getIntersectionPoint(event);
          if (intersection) {
            const newPosition = intersection.sub(dragOffset.current);

            // Considerar a rotação da peça para movimento correto

            const currentWorldPosition = getWorldPosition(); // Use getWorldPosition function
            let projectedPosition;

            // Para todas as peças, movimento no plano horizontal X-Z (preservar Y)
            // A rotação da peça não deve afetar o movimento horizontal
            projectedPosition = new THREE.Vector3(
              newPosition.x,
              currentWorldPosition[1],
              newPosition.z
            );

            onDrag(
              { id: pieceId, position: projectedPosition.toArray() },
              projectedPosition
            );
          }
        } else {
          // Movimento vertical simples baseado na diferença do mouse
          const mouseDelta = initialMouseY.current - event.clientY; // Invertido: mouse para cima = peça sobe
          const sensitivity = 0.005; // Sensibilidade mais baixa para controle preciso
          const heightChange = mouseDelta * sensitivity;
          // Calcular altura mínima baseada no tipo de peça e rotação
          const currentRotation = new THREE.Euler(...getWorldRotation());
          const isVertical = Math.abs(currentRotation.z - Math.PI / 2) < 0.1;

          let minHeight = 0;
          if (isVertical) {
            // Para peças em pé, altura mínima baseada no tipo de peça
            // Assumindo que pieceDimensions está disponível ou podemos inferir do tipo
            // Para Grid4m em pé: altura mínima = metade do comprimento (2m)
            minHeight = 2.0; // Altura mínima para peças em pé
          }

          const newHeight = Math.max(
            initialHeight.current + heightChange,
            minHeight
          );

          // Para movimento vertical, criar um Vector3 que preserve X e Z
          const currentWorldPosition = getWorldPosition(); // Use getWorldPosition function
          const projectedPosition = new THREE.Vector3(
            currentWorldPosition[0],
            newHeight,
            currentWorldPosition[2]
          );

          onDrag(
            { id: pieceId, position: projectedPosition.toArray() },
            projectedPosition
          );
        }
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingLocal && onDrop) {
        onDrop({ position: worldPosition });
        setIsDraggingLocal(false);

        // Resetar cursor
        if (gl.domElement) {
          gl.domElement.style.cursor = "default";
        }
      }
    };

    if (isDraggingLocal) {
      document.addEventListener("pointermove", handleGlobalPointerMove);
      document.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", handleGlobalPointerMove);
      document.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [
    isDraggingLocal,
    onDrag,
    onDrop,
    getIntersectionPoint,
    pieceId,
    getWorldPosition,
    getWorldRotation,
    gl,
    movementMode,
    worldPosition,
    isLocked,
  ]);

  const handlePointerOver = () => {
    setHovered(true);
    if (gl.domElement) {
      // Cursor diferente baseado no modo
      if (movementMode === "vertical") {
        gl.domElement.style.cursor = "ns-resize"; // Seta vertical
      } else {
        gl.domElement.style.cursor = "grab";
      }
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (gl.domElement) {
      gl.domElement.style.cursor = "default";
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
        <Box
          args={[
            pieceDimensions[0] + 0.1,
            pieceDimensions[1] + 0.1,
            pieceDimensions[2] + 0.1,
          ]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.3}
            wireframe
          />
        </Box>
      )}

      {/* Indicador de seleção múltipla */}
      {isMultiSelected && !isSelected && (
        <Box
          args={[
            pieceDimensions[0] + 0.08,
            pieceDimensions[1] + 0.08,
            pieceDimensions[2] + 0.08,
          ]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color="#ff6b6b"
            transparent
            opacity={0.25}
            wireframe
          />
        </Box>
      )}

      {/* Indicador de peça bloqueada */}
      {isLocked && (
        <Box
          args={[
            pieceDimensions[0] + 0.12,
            pieceDimensions[1] + 0.12,
            pieceDimensions[2] + 0.12,
          ]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.2}
            wireframe
          />
        </Box>
      )}

      {/* Indicador de hover */}
      {hovered && !isSelected && !isMultiSelected && (
        <Box
          args={[
            pieceDimensions[0] + 0.05,
            pieceDimensions[1] + 0.05,
            pieceDimensions[2] + 0.05,
          ]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color="#ffff00"
            transparent
            opacity={0.2}
            wireframe
          />
        </Box>
      )}

      {/* Pontos de encaixe - apenas quando selecionada */}
      {isSelected &&
        snapPoints.map((point, index) => {
          // Diferentes tamanhos e cores para diferentes tipos de pontos
          const isEndPoint = Math.abs(point[0]) > 0.1; // Pontos nas extremidades
          const isVerticalPoint = Math.abs(point[1]) > 0.1; // Pontos verticais
          const isQuarterPoint =
            Math.abs(point[0]) > 0.05 && Math.abs(point[0]) < 0.1; // Pontos de quarto

          let color = "#00ff00"; // Verde padrão
          let size = 0.08;
          let opacity = 0.7;

          if (isEndPoint && !isVerticalPoint) {
            color = "#ff6b6b"; // Vermelho para extremidades principais
            size = 0.18;
            opacity = 1.0;
          } else if (isVerticalPoint) {
            color = "#4ecdc4"; // Azul para pontos verticais
            size = 0.12;
            opacity = 0.8;
          } else if (isQuarterPoint) {
            color = "#ffa500"; // Laranja para pontos de quarto
            size = 0.1;
            opacity = 0.6;
          }

          return (
            <Box key={index} args={[size, size, size]} position={point}>
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </Box>
          );
        })}

      {/* Indicador de movimento vertical - apenas quando selecionada e no modo vertical */}
      {isSelected && movementMode === "vertical" && (
        <group>
          {/* Verificar se a peça está em pé (Z+90°) */}
          {(() => {
            const currentRotation = new THREE.Euler(...getWorldRotation());
            const isVertical = Math.abs(currentRotation.z - Math.PI / 2) < 0.1;

            if (isVertical) {
              // Para peças em pé: seta vertical roxa
              return (
                <group>
                  {/* Linha vertical de referência (8 metros) */}
                  <Box args={[0.05, 8, 0.05]} position={[0, 4, 0]}>
                    <meshBasicMaterial
                      color="#8b5cf6"
                      transparent
                      opacity={0.3}
                    />
                  </Box>
                  {/* Indicador de altura atual - seta vertical */}
                  <Box
                    args={[0.1, 0.3, 0.1]}
                    position={[0, actualWorldPosition[1], 0]}
                  >
                    <meshBasicMaterial
                      color="#8b5cf6"
                      transparent
                      opacity={0.8}
                    />
                  </Box>
                  {/* Marcadores de altura */}
                  {[0, 2, 4, 6, 8].map((height) => (
                    <Box
                      key={height}
                      args={[0.05, 0.1, 0.05]}
                      position={[0, height, 0]}
                    >
                      <meshBasicMaterial
                        color="#8b5cf6"
                        transparent
                        opacity={0.6}
                      />
                    </Box>
                  ))}
                </group>
              );
            } else {
              // Para peças normais: seta horizontal vermelha
              return (
                <group>
                  {/* Linha vertical de referência (8 metros) */}
                  <Box args={[0.05, 8, 0.05]} position={[0, 4, 0]}>
                    <meshBasicMaterial
                      color="#ff6b6b"
                      transparent
                      opacity={0.3}
                    />
                  </Box>
                  {/* Indicador de altura atual */}
                  <Box
                    args={[0.3, 0.1, 0.3]}
                    position={[0, actualWorldPosition[1], 0]}
                  >
                    <meshBasicMaterial
                      color="#ff6b6b"
                      transparent
                      opacity={0.8}
                    />
                  </Box>
                  {/* Marcadores de altura */}
                  {[0, 2, 4, 6, 8].map((height) => (
                    <Box
                      key={height}
                      args={[0.1, 0.05, 0.1]}
                      position={[0, height, 0]}
                    >
                      <meshBasicMaterial
                        color="#ff6b6b"
                        transparent
                        opacity={0.6}
                      />
                    </Box>
                  ))}
                </group>
              );
            }
          })()}
        </group>
      )}
    </group>
  );
};

export default BaseTrussPiece;
