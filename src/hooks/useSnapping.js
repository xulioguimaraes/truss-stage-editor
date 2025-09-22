import { useCallback } from 'react';
import * as THREE from 'three';

export const useSnapping = (pieces, snapThreshold = 0.3) => {
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
      case 'Grid4m':
        const length = parseFloat(piece.type.replace('Grid', '').replace('m', ''));
        return [
          ...basePoints,
          [length/2, 0, 0],    // Extremidade direita
          [-length/2, 0, 0],   // Extremidade esquerda
          [0, 0.2, 0],         // Topo
          [0, -0.2, 0],        // Base
        ];
      
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
    const snapResult = findNearestSnapPoint(position, excludeId);
    return snapResult ? snapResult.point : position;
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

