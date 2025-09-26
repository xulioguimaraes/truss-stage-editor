import { useCallback } from "react";
import * as THREE from "three";

export const useSnapping = (pieces, snapThreshold = 1.0) => {
  const getSnapPoints = useCallback((pieceType) => {
    // Definir pontos de encaixe baseados no tipo de peça
    const basePoints = [
      [0, 0, 0], // Centro
    ];

    switch (pieceType) {
      case "Cube5Faces":
        return [
          ...basePoints,
          [0, 0.5, 0], // Topo
          [0.5, 0, 0], // Direita
          [-0.5, 0, 0], // Esquerda
          [0, 0, 0.5], // Frente
          [0, 0, -0.5], // Trás
        ];

      case "Grid0_5m":
      case "Grid1m":
      case "Grid2m":
      case "Grid3m":
      case "Grid4m": {
        const length = parseFloat(
          pieceType.replace("Grid", "").replace("m", "")
        );
        return [
          // Pontos de encaixe nas extremidades (principais para conexão)
          [length / 2, 0, 0], // Extremidade direita
          [-length / 2, 0, 0], // Extremidade esquerda

          // Pontos de encaixe verticais (para conexões em altura)
          [length / 2, 0.2, 0], // Topo da extremidade direita
          [-length / 2, 0.2, 0], // Topo da extremidade esquerda
          [length / 2, -0.2, 0], // Base da extremidade direita
          [-length / 2, -0.2, 0], // Base da extremidade esquerda

          // Pontos de encaixe no centro (para conexões centrais)
          [0, 0.2, 0], // Topo central
          [0, -0.2, 0], // Base central

          // Pontos adicionais para facilitar o alinhamento
          [length / 4, 0, 0], // Quarto direito
          [-length / 4, 0, 0], // Quarto esquerdo
          [length / 4, 0.1, 0], // Quarto direito alto
          [-length / 4, 0.1, 0], // Quarto esquerdo alto
          [length / 4, -0.1, 0], // Quarto direito baixo
          [-length / 4, -0.1, 0], // Quarto esquerdo baixo

          // Pontos de encaixe para grids em pé (rotação Z)
          [0, length / 2, 0], // Topo (quando em pé)
          [0, -length / 2, 0], // Base (quando em pé)
          [0, length / 2, 0.1], // Topo frente (quando em pé)
          [0, length / 2, -0.1], // Topo trás (quando em pé)
          [0, -length / 2, 0.1], // Base frente (quando em pé)
          [0, -length / 2, -0.1], // Base trás (quando em pé)

          // Pontos de encaixe laterais para grids em pé
          [0.1, 0, 0], // Lado direito (quando em pé)
          [-0.1, 0, 0], // Lado esquerdo (quando em pé)
          [0.1, length / 4, 0], // Lado direito meio (quando em pé)
          [-0.1, length / 4, 0], // Lado esquerdo meio (quando em pé)
          [0.1, -length / 4, 0], // Lado direito meio baixo (quando em pé)
          [-0.1, -length / 4, 0], // Lado esquerdo meio baixo (quando em pé)
        ];
      }

      case "Sapata":
        return [
          ...basePoints,
          [0, 0.3, 0], // Centro do topo
          [0.2, 0.3, 0], // Lado direito
          [-0.2, 0.3, 0], // Lado esquerdo
          [0, 0.3, 0.2], // Frente
          [0, 0.3, -0.2], // Trás
        ];

      case "Cumeeira":
        return [
          ...basePoints,
          [0, 0.5, 0], // Topo da curva
          [-0.5, 0, 0], // Extremidade esquerda
          [0.5, 0, 0], // Extremidade direita
          [0, 0, 0.2], // Frente
          [0, 0, -0.2], // Trás
        ];

      default:
        return basePoints;
    }
  }, []);

  const findNearestSnapPoint = useCallback(
    (position, excludeId = null, currentPieceType = null) => {
      let nearestPoint = null;
      let nearestDistance = Infinity;
      let nearestPiece = null;
      let bestScore = -Infinity;

      pieces.forEach((piece) => {
        if (piece.id === excludeId) return;

        const pieceSnapPoints = getSnapPoints(piece.type);

        pieceSnapPoints.forEach((snapPoint) => {
          // Transformar o ponto de encaixe para a posição mundial da peça
          const worldPoint = new THREE.Vector3(...snapPoint)
            .applyEuler(new THREE.Euler(...piece.rotation))
            .add(new THREE.Vector3(...piece.position));

          const distance = position.distanceTo(worldPoint);

          // Lógica inteligente de encaixe para grids
          let effectiveThreshold = snapThreshold;
          let snapScore = 0; // Score para priorizar encaixes mais lógicos

          // Se ambas as peças são grids, aumentar significativamente o threshold
          if (
            piece.type.startsWith("Grid") &&
            currentPieceType &&
            currentPieceType.startsWith("Grid")
          ) {
            effectiveThreshold = snapThreshold * 3.0; // 3x mais tolerante para grid-to-grid

            // Priorizar encaixes lógicos baseados no tamanho das peças
            const currentLength = parseFloat(
              currentPieceType.replace("Grid", "").replace("m", "")
            );
            const targetLength = parseFloat(
              piece.type.replace("Grid", "").replace("m", "")
            );

            // Se a peça atual é maior que a target, priorizar encaixe no topo
            if (currentLength > targetLength) {
              // Priorizar pontos superiores (Y positivo)
              if (snapPoint[1] > 0.1) {
                snapScore += 10; // Bonus para pontos superiores
              }
              // Penalizar pontos centrais quando há opção superior
              if (
                Math.abs(snapPoint[1]) < 0.05 &&
                Math.abs(snapPoint[0]) < 0.1
              ) {
                snapScore -= 5; // Penalidade para centro
              }
            }
            // Se a peça atual é menor que a target, priorizar encaixe nas extremidades
            else if (currentLength < targetLength) {
              // Priorizar pontos de extremidade
              if (Math.abs(snapPoint[0]) > 0.1) {
                snapScore += 8; // Bonus para extremidades
              }
            }
          }
          // Se apenas uma peça é grid, ser moderadamente tolerante
          else if (
            piece.type.startsWith("Grid") ||
            (currentPieceType && currentPieceType.startsWith("Grid"))
          ) {
            effectiveThreshold = snapThreshold * 2.0; // 2x mais tolerante
          }

          // Se é um ponto de extremidade (pontas dos grids), ser ainda mais tolerante
          const isEndPoint = Math.abs(snapPoint[0]) > 0.1; // Pontos nas extremidades
          if (isEndPoint && piece.type.startsWith("Grid")) {
            effectiveThreshold *= 1.5; // 1.5x adicional para pontas
            snapScore += 3; // Bonus para extremidades
          }

          // Para grids em pé (rotação Z), priorizar encaixe vertical
          const isVerticalGrid =
            Math.abs(piece.rotation[2] - Math.PI / 2) < 0.1 ||
            Math.abs(piece.rotation[2] + Math.PI / 2) < 0.1;
          if (isVerticalGrid && piece.type.startsWith("Grid")) {
            effectiveThreshold *= 1.3; // 1.3x adicional para grids verticais
            snapScore += 2; // Bonus para grids verticais
          }

          // Priorizar pontos superiores para grids grandes
          if (currentPieceType && currentPieceType.startsWith("Grid")) {
            const currentLength = parseFloat(
              currentPieceType.replace("Grid", "").replace("m", "")
            );
            if (currentLength >= 2.0 && snapPoint[1] > 0.1) {
              snapScore += 5; // Bonus para pontos superiores em grids grandes
            }
          }

          if (distance < effectiveThreshold) {
            // Usar score combinado (distância + score lógico)
            const combinedScore = snapScore - distance / effectiveThreshold;

            if (combinedScore > bestScore) {
              bestScore = combinedScore;
              nearestDistance = distance;
              nearestPoint = worldPoint;
              nearestPiece = piece;
            }
          }
        });
      });

      return nearestPoint
        ? {
            point: nearestPoint,
            piece: nearestPiece,
            distance: nearestDistance,
          }
        : null;
    },
    [pieces, getSnapPoints, snapThreshold]
  );

  const snapToNearest = useCallback(
    (position, excludeId = null, currentPieceType = null) => {
      const snapResult = findNearestSnapPoint(
        position,
        excludeId,
        currentPieceType
      );

      // Se não há snap, retornar a posição original
      if (!snapResult) {
        //console.log('🔴 SNAPPING: No snap found, returning original position');
        return position;
      }

      // Se há snap, retornar o ponto de encaixe
      //console.log('🔴 SNAPPING: Snap found, returning snap point');
      return snapResult.point;
    },
    [findNearestSnapPoint]
  );

  const getSnapPreview = useCallback(
    (position, excludeId = null, currentPieceType = null) => {
      const snapResult = findNearestSnapPoint(
        position,
        excludeId,
        currentPieceType
      );

      if (snapResult) {
        // Adicionar informações extras para o preview
        return {
          ...snapResult,
          isNearSnap: snapResult.distance < snapThreshold * 0.5, // Muito próximo
          isCloseSnap: snapResult.distance < snapThreshold, // Próximo
          snapStrength: Math.max(0, 1 - snapResult.distance / snapThreshold), // Força do encaixe (0-1)
        };
      }

      return null;
    },
    [findNearestSnapPoint, snapThreshold]
  );

  const getPieceDimensions = useCallback((pieceType) => {
    switch (pieceType) {
      case "Cube5Faces":
        return [1, 1, 1]; // Cubo 1x1x1

      case "Grid0_5m":
        return [0.5, 0.4, 0.4]; // Comprimento 0.5m, altura 0.4m, largura 0.4m
      case "Grid1m":
        return [1, 0.4, 0.4]; // Comprimento 1m, altura 0.4m, largura 0.4m
      case "Grid2m":
        return [2, 0.4, 0.4]; // Comprimento 2m, altura 0.4m, largura 0.4m
      case "Grid3m":
        return [3, 0.4, 0.4]; // Comprimento 3m, altura 0.4m, largura 0.4m
      case "Grid4m":
        return [4, 0.4, 0.4]; // Comprimento 4m, altura 0.4m, largura 0.4m

      case "Sapata":
        return [0.8, 0.4, 0.8]; // Base 0.8x0.8, altura 0.4m

      case "Cumeeira":
        return [1, 0.5, 0.2]; // Largura 1m, altura 0.5m, profundidade 0.2m

      default:
        return [1, 1, 1]; // Dimensões padrão
    }
  }, []);

  return {
    getSnapPoints,
    findNearestSnapPoint,
    snapToNearest,
    getSnapPreview,
    getPieceDimensions,
  };
};
