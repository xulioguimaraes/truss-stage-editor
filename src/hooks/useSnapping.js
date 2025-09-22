import { useCallback } from 'react';
import * as THREE from 'three';

export const useSnapping = (pieces, snapThreshold = 0.5) => {
  const getSnapPoints = useCallback((piece) => {
    // Definir pontos de encaixe baseados no tipo de peça
    const basePoints = [
      [0, 0, 0], // Centro
    ];

    switch (piece.type) {
      case 'Cube5Faces':
        return [
          ...basePoints,
          [0, 0.5, 0],    // Topo
          [0.5, 0, 0],    // Direita
          [-0.5, 0, 0],   // Esquerda
          [0, 0, 0.5],    // Frente
          [0, 0, -0.5],   // Trás
        ];
      
      case 'Grid0_5m':
      case 'Grid1m':
      case 'Grid2m':
      case 'Grid3m':
      case 'Grid4m': {
        const length = parseFloat(piece.type.replace('Grid', '').replace('m', ''));
        return [
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
      }
      
      case 'Sapata':
        return [
          ...basePoints,
          [0, 0.3, 0],    // Centro do topo
          [0.2, 0.3, 0],  // Lado direito
          [-0.2, 0.3, 0], // Lado esquerdo
          [0, 0.3, 0.2],  // Frente
          [0, 0.3, -0.2], // Trás
        ];
      
      case 'Cumeeira':
        return [
          ...basePoints,
          [0, 0.5, 0],     // Topo da curva
          [-0.5, 0, 0],    // Extremidade esquerda
          [0.5, 0, 0],     // Extremidade direita
          [0, 0, 0.2],     // Frente
          [0, 0, -0.2],    // Trás
        ];
      
      default:
        return basePoints;
    }
  }, []);

  const findNearestSnapPoint = useCallback((position, excludeId = null) => {
    let nearestPoint = null;
    let nearestDistance = Infinity;
    let nearestPiece = null;

    pieces.forEach(piece => {
      if (piece.id === excludeId) return;

      const pieceSnapPoints = getSnapPoints(piece);
      
      pieceSnapPoints.forEach(snapPoint => {
        // Transformar o ponto de encaixe para a posição mundial da peça
        const worldPoint = new THREE.Vector3(...snapPoint)
          .applyEuler(new THREE.Euler(...piece.rotation))
          .add(new THREE.Vector3(...piece.position));

        const distance = position.distanceTo(worldPoint);
        
        if (distance < snapThreshold && distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = worldPoint;
          nearestPiece = piece;
        }
      });
    });

    return nearestPoint ? { point: nearestPoint, piece: nearestPiece, distance: nearestDistance } : null;
  }, [pieces, getSnapPoints, snapThreshold]);

  const snapToNearest = useCallback((position, excludeId = null) => {
    console.log('🔴 SNAPPING INPUT:', {
      'Position': position,
      'Position type': typeof position,
      'Position isArray': Array.isArray(position),
      'Position values': Array.isArray(position) ? 
        `X:${position[0]?.toFixed(3)}, Y:${position[1]?.toFixed(3)}, Z:${position[2]?.toFixed(3)}` :
        `X:${position.x?.toFixed(3)}, Y:${position.y?.toFixed(3)}, Z:${position.z?.toFixed(3)}`,
      'ExcludeId': excludeId
    });
    
    const snapResult = findNearestSnapPoint(position, excludeId);
    
    console.log('🔴 SNAPPING RESULT:', {
      'SnapResult': snapResult,
      'HasSnap': !!snapResult
    });
    
    // Se não há snap, retornar a posição original
    if (!snapResult) {
      console.log('🔴 SNAPPING: No snap found, returning original position');
      return position;
    }
    
    // Se há snap, retornar o ponto de encaixe
    console.log('🔴 SNAPPING: Snap found, returning snap point');
    return snapResult.point;
  }, [findNearestSnapPoint]);

  const getSnapPreview = useCallback((position, excludeId = null) => {
    const snapResult = findNearestSnapPoint(position, excludeId);
    return snapResult;
  }, [findNearestSnapPoint]);

  return {
    getSnapPoints,
    findNearestSnapPoint,
    snapToNearest,
    getSnapPreview,
  };
};

